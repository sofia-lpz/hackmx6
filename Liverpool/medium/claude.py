import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from random import sample
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications import VGG16, ResNet50, Xception
from tensorflow.keras.applications.vgg16 import preprocess_input as vgg_preprocess
from tensorflow.keras.applications.resnet import preprocess_input as resnet_preprocess
from tensorflow.keras.applications.xception import preprocess_input as xception_preprocess
from tensorflow.keras.models import Model

# Force CPU usage
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
tf.config.set_visible_devices([], 'GPU')

# Configure TensorFlow to use CPU
tf_config = tf.compat.v1.ConfigProto(
    device_count={'GPU': 0},
    intra_op_parallelism_threads=4,
    inter_op_parallelism_threads=4
)
tf.compat.v1.Session(config=tf_config)

class FeatureExtractor:
    """Extract features from images using different pre-trained models"""
    
    def __init__(self, arch='VGG'):
        """Initialize the feature extractor with specified architecture"""
        self.arch = arch
        self.model = self._initialize_model()
        
    def _initialize_model(self):
        """Initialize the appropriate model based on architecture choice"""
        with tf.device('/CPU:0'):  # Force CPU usage
            if self.arch == 'VGG':
                base_model = VGG16(weights='imagenet')
                return Model(inputs=base_model.input, outputs=base_model.get_layer('fc1').output)
            elif self.arch == 'ResNet':
                base_model = ResNet50(weights='imagenet')
                return Model(inputs=base_model.input, outputs=base_model.get_layer('avg_pool').output)
            elif self.arch == 'Xception':
                base_model = Xception(weights='imagenet')
                return Model(inputs=base_model.input, outputs=base_model.get_layer('avg_pool').output)
            else:
                raise ValueError(f"Unsupported architecture: {self.arch}")
    
    def extract_features(self, img):
        """Extract features from an image"""
        try:
            # Resize image based on architecture requirements
            target_size = (299, 299) if self.arch == 'Xception' else (224, 224)
            img = img.resize(target_size)
            img = img.convert('RGB')
            
            # Convert to array and preprocess
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            
            # Apply appropriate preprocessing
            preprocess_map = {
                'VGG': vgg_preprocess,
                'ResNet': resnet_preprocess,
                'Xception': xception_preprocess
            }
            x = preprocess_map[self.arch](x)
            
            # Extract and normalize features using CPU
            with tf.device('/CPU:0'):
                features = self.model.predict(x, batch_size=1)
            return features / np.linalg.norm(features)
            
        except Exception as e:
            print(f"Error extracting features: {str(e)}")
            return None

class ImageSimilarityAnalyzer:
    """Analyze image similarity using different models"""
    
    def __init__(self, listing_data, model_architecture='ResNet', batch_size=32):
        self.listing_data = listing_data
        self.feature_extractor = FeatureExtractor(arch=model_architecture)
        self.image_features = {}
        self.batch_size = batch_size
        
    def extract_features_batch(self, image_paths, indices):
        """Extract features for a batch of images"""
        total_images = len(image_paths)
        processed = 0
        
        # Process in batches to manage memory
        for i in range(0, total_images, self.batch_size):
            batch_paths = image_paths[i:i + self.batch_size]
            batch_indices = indices[i:i + self.batch_size]
            
            for idx, img_path in zip(batch_indices, batch_paths):
                try:
                    img = image.load_img(img_path)
                    feature = self.feature_extractor.extract_features(img)
                    if feature is not None:
                        self.image_features[idx] = feature
                    
                    # Update progress
                    processed += 1
                    if processed % 100 == 0:
                        print(f"Processed {processed}/{total_images} images")
                        
                except Exception as e:
                    print(f"Error processing image at index {idx}: {str(e)}")
    
    def find_similar_images(self, query_image_path, top_k=10):
        """Find similar images to the query image"""
        try:
            # Extract features from query image
            query_image = image.load_img(query_image_path)
            query_features = self.feature_extractor.extract_features(query_image)
            
            if query_features is None:
                return [], []
            
            # Compute similarities
            similarities = {}
            for idx, feat in self.image_features.items():
                similarity = np.sum((query_features - feat)**2) ** 0.5
                similarities[idx] = similarity
            
            # Sort by similarity
            similar_items = sorted(similarities.items(), key=lambda x: x[1])
            top_indices = [idx for idx, _ in similar_items[:top_k]]
            top_scores = [score for _, score in similar_items[:top_k]]
            
            return top_indices, top_scores
            
        except Exception as e:
            print(f"Error finding similar images: {str(e)}")
            return [], []

def main():
    try:
        print("Starting image similarity analysis (CPU-only mode)")
        
        # Load data
        listing_data = pd.read_csv("current_farfetch_listings.csv")
        print(f"Loaded {len(listing_data)} products from CSV")
        
        # Initialize analyzer with smaller batch size for CPU
        analyzer = ImageSimilarityAnalyzer(listing_data, batch_size=16)
        
        # Extract features for all images
        print("Extracting features (this may take longer on CPU)...")
        analyzer.extract_features_batch(
            listing_data['modelImages_path'].values,
            listing_data.index.values
        )
        
        # Select random query image
        query_idx = np.random.choice(listing_data.index)
        query_image_path = listing_data.iloc[query_idx]['modelImages_path']
        print(f"Selected query image: {query_image_path}")
        
        # Find similar images
        print("Finding similar images...")
        top_indices, top_scores = analyzer.find_similar_images(query_image_path)
        
        # Display results
        print("\nResults:")
        for idx, score in zip(top_indices, top_scores):
            product = listing_data.iloc[idx]
            print(f"Brand: {product['brand.name']}, Similarity Score: {score:.3f}")
        
    except Exception as e:
        print(f"Error in main execution: {str(e)}")

if __name__ == "__main__":
    main()