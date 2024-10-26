import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from random import sample
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications import VGG16, ResNet50, Xception
from tensorflow.keras.applications.vgg16 import preprocess_input as vgg_preprocess
from tensorflow.keras.applications.resnet import preprocess_input as resnet_preprocess
from tensorflow.keras.applications.xception import preprocess_input as xception_preprocess
from tensorflow.keras.models import Model

class ImageLoader:
    @staticmethod
    def load_sample_images(cutout_img_dir="/content/cutout-img/cutout",
                          model_img_dir="/content/model-img/model",
                          sample_size=10):
        """Load and display sample images from both cutout and model directories"""
        
        def display_images(image_paths, title):
            fig = plt.figure(figsize=(10, 5))
            print(f"=============={title}==============")
            for i, img_path in enumerate(image_paths):
                plt.subplot(2, 5, i+1)
                loaded_img = image.load_img(img_path)
                img_array = image.img_to_array(loaded_img, dtype='int')
                plt.imshow(img_array)
                plt.axis('off')
            plt.show()
            print()
        
        try:
            # List images in directories
            cutout_images = [os.path.join(cutout_img_dir, f) for f in os.listdir(cutout_img_dir)]
            model_images = [os.path.join(model_img_dir, f) for f in os.listdir(model_img_dir)]
            
            # Sample and display images
            display_images(sample(cutout_images, sample_size), "Cutout Images")
            display_images(sample(model_images, sample_size), "Model Images")
            
        except Exception as e:
            print(f"Error loading images: {str(e)}")

class FeatureExtractor:
    """Extract features from images using different pre-trained models"""
    
    def __init__(self, arch='VGG'):
        """Initialize the feature extractor with specified architecture"""
        self.arch = arch
        self.model = self._initialize_model()
        
    def _initialize_model(self):
        """Initialize the appropriate model based on architecture choice"""
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
            
            # Extract and normalize features
            features = self.model.predict(x)
            return features / np.linalg.norm(features)
            
        except Exception as e:
            print(f"Error extracting features: {str(e)}")
            return None

class ImageSimilarityAnalyzer:
    """Analyze image similarity using different models"""
    
    def __init__(self, listing_data, model_architecture='ResNet'):
        self.listing_data = listing_data
        self.feature_extractor = FeatureExtractor(arch=model_architecture)
        self.image_features = {}
        
    def extract_features_batch(self, image_paths, indices):
        """Extract features for a batch of images"""
        for idx, img_path in zip(indices, image_paths):
            try:
                img = image.load_img(img_path)
                feature = self.feature_extractor.extract_features(img)
                if feature is not None:
                    self.image_features[idx] = feature
            except Exception as e:
                print(f"Error processing image at index {idx}: {str(e)}")
    
    def find_similar_images(self, query_image_path, top_k=10):
        """Find similar images to the query image"""
        try:
            # Extract features from query image
            query_image = image.load_img(query_image_path)
            query_features = self.feature_extractor.extract_features(query_image)
            
            # Compute similarities
            similarities = {
                idx: np.sum((query_features - feat)**2) ** 0.5
                for idx, feat in self.image_features.items()
            }
            
            # Sort by similarity
            similar_items = sorted(similarities.items(), key=lambda x: x[1])
            top_indices = [idx for idx, _ in similar_items[:top_k]]
            top_scores = [score for _, score in similar_items[:top_k]]
            
            return top_indices, top_scores
            
        except Exception as e:
            print(f"Error finding similar images: {str(e)}")
            return [], []
    
    def display_results(self, query_image_path, top_indices, top_scores):
        """Display query image and similar images with metadata"""
        try:
            # Display query image
            plt.figure(figsize=(10, 10))
            plt.imshow(image.img_to_array(image.load_img(query_image_path), dtype='int'))
            plt.axis('off')
            plt.title("Query Image")
            plt.show()
            
            # Display similar images
            similar_images = self.listing_data.iloc[top_indices]
            fig = plt.figure(figsize=(15, 5))
            for i, (_, row) in enumerate(similar_images.iterrows()):
                plt.subplot(2, 5, i+1)
                img = image.load_img(row['modelImages_path'])
                plt.imshow(image.img_to_array(img, dtype='int'))
                plt.title(f"{row['brand.name']}\nScore: {top_scores[i]:.3f}")
                if 'price' in row:
                    plt.xlabel(f"Price: {row['price']}")
                plt.axis('off')
            plt.tight_layout()
            plt.show()
            
        except Exception as e:
            print(f"Error displaying results: {str(e)}")

# Example usage
def main():
    try:
        # Load data
        listing_data = pd.read_csv("current_farfetch_listings.csv")
        
        # Initialize analyzer
        analyzer = ImageSimilarityAnalyzer(listing_data)
        
        # Extract features for all images
        analyzer.extract_features_batch(
            listing_data['modelImages_path'],
            listing_data.index
        )
        
        # Select random query image
        query_idx = np.random.choice(listing_data.index)
        query_image_path = listing_data.iloc[query_idx]['modelImages_path']
        
        # Find and display similar images
        top_indices, top_scores = analyzer.find_similar_images(query_image_path)
        analyzer.display_results(query_image_path, top_indices, top_scores)
        
    except Exception as e:
        print(f"Error in main execution: {str(e)}")

if __name__ == "__main__":
    main()