# Read the data files
listing_data = pd.read_csv("current_farfetch_listings.csv")
listing_data.head()

# Extracting the Image 
def load_images():
    
    # Store the directory path in a varaible
    cutout_img_dir = "/content/cutout-img/cutout"
    model_img_dir = "/content/model-img/model"
    
    # list the images in these directories
    cutout_images = os.listdir(cutout_img_dir)
    model_images = os.listdir(model_img_dir)
    
    # load 10 Random Cutout Images: Sample out 10 images randomly from the above list
    sample_cutout_images = sample(cutout_images,10)
    fig = plt.figure(figsize=(10, 5))
    
    print("==============Cutout Images==============")
    for i, img_name in enumerate(sample_cutout_images):
        plt.subplot(2, 5, i+1)
        img_path = os.path.join(cutout_img_dir, img_name)
        loaded_img = image.load_img(img_path)
        img_array = image.img_to_array(loaded_img, dtype='int')
        plt.imshow(img_array)
        plt.axis('off')
        
    plt.show()
    print()
    # load 10 Random Model Images: Sample out 10 images randomly from the above list
    sample_model_images = sample(model_images,10)
    fig = plt.figure(figsize=(10,5))
    
    print("==============Model Images==============")
    for i, img_name in enumerate(sample_model_images):
        plt.subplot(2, 5, i+1)
        img_path = os.path.join(model_img_dir, img_name)
        loaded_img = image.load_img(img_path)
        img_array = image.img_to_array(loaded_img, dtype='int')
        plt.imshow(img_array)
        plt.axis('off')
        
    plt.show()


# Creating a class for feature extraction and finding the most similar images'''
Comparing 3 different models1. VGG 16
2. ResNet 50
3. Xception
'''class FeatureExtractor:
    
    # Constructor
    def __init__(self, arch='VGG'):
        
        self.arch = arch
        
        # Using VGG -16 as the architecture with ImageNet weights
        if self.arch == 'VGG' :
            base_model = VGG16(weights = 'imagenet')
            self.model = Model(inputs = base_model.input, outputs = base_model.get_layer('fc1').output)
        
        # Using the ResNet 50 as the architecture with ImageNet weights
        elif self.arch == 'ResNet':
            base_model = ResNet50(weights = 'imagenet')
            self.model = Model(inputs = base_model.input, outputs = base_model.get_layer('avg_pool').output)
        
        # Using the Xception as the architecture with ImageNet weights
        elif self.arch == 'Xception':
            base_model = Xception(weights = 'imagenet')
            self.model = Model(inputs = base_model.input, outputs = base_model.get_layer('avg_pool').output)
            
    
    # Method to extract image features
    def extract_features(self, img):
        
        # The VGG 16 & ResNet 50 model has images of 224,244 as input while the Xception has 299, 299
        if self.arch == 'VGG' or self.arch == 'ResNet':
            img = img.resize((224, 224))
        elif self.arch == 'Xception':
            img = img.resize((299, 299))
        
        # Convert the image channels from to RGB
        img = img.convert('RGB')
        
        # Convert into array
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        
        if self.arch == 'VGG':
            # Proprocess the input as per vgg 16
            x = vgg_preprocess(x)
            
        elif self.arch == 'ResNet':
            # Proprocess the input as per ResNet 50
            x = resnet_preprocess(x)
            
        elif self.arch == 'Xception':
            # Proprocess the input as per ResNet 50
            x = xception_preprocess(x)
        
        
        # Extract the features
        features = self.model.predict(x) 
        
        # Scale the features
        features = features / np.linalg.norm(features)
        
        return features

# Create the model object and extract the features of 10000 images (ResNet)
resnet_feature_extractor = FeatureExtractor(arch='ResNet')# dictionary to store the features and index of the image
image_features_resnet = {}
for i, (idx, img_path) in enumerate(zip(index_values, modelImages)):
    
    # Extract features and store in a dictionary
    img = image.load_img(img_path)
    feature = resnet_feature_extractor.extract_features(img)
    image_features_resnet[idx] = feature

# Create a query
queryImage_idx = np.random.choice(index_values)
queryImage_path = listing_data.iloc[queryImage_idx]['modelImages_path']
queryImage = image.load_img(queryImage_path)# Extract Features from queryImage# ResNet
queryFeatures_Resnet = resnet_feature_extractor.extract_features(queryImage)

# Compute Similarity between queryFeatures and every other image in image_features_resnet# ResNet
similarity_images_resnet = {}
for idx, feat in image_features_resnet.items():
    
    # Compute the similarity using Euclidean Distance
    similarity_images_resnet[idx] = np.sum((queryFeatures_Resnet - feat)**2) ** 0.5
    
similarity_resnet_sorted = sorted(similarity_images_resnet.items(), key = lambda x : x[1], reverse=False)
top_10_simiarity_scores_resnet = [score for _, score in similarity_resnet_sorted][ : 10]
top_10_indexes_resnet = [idx for idx, _ in similarity_resnet_sorted][ : 10]

# Plot the results from all three models and prepare a comparisonprint("========================================== QUERY IMAGE ===============================================")
plt.figure(figsize=(10,10))
plt.imshow(image.img_to_array(queryImage, dtype='int'))
plt.axis('off')
plt.show()
print("======================================================================================================")
print()# 1. ResNet
top_10_similar_imgs_Resnet = listing_data.iloc[top_10_indexes_resnet]['modelImages_path']
brand_Resnet = listing_data.iloc[top_10_indexes_resnet]['brand.name']
map_resnet = MAP(top_10_simiarity_scores_resnet, threshold=0.55, k=10)print("========================================== ResNet Results =============================================")
fig = plt.figure(figsize=(15,5))
for i, (img_path, brand) in enumerate(zip(top_10_similar_imgs_Resnet, brand_Resnet)):
    plt.subplot(2, 5, i+1)
    img = image.load_img(img_path)
    img_arr = image.img_to_array(img, dtype='int')
    plt.imshow(img_arr)
    plt.xlabel(price)
    plt.title(brand)
    plt.axis('off')
plt.show()
print("======================================================================================================")