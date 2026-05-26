import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {colors} from '../../theme/colors';
import {serviceService} from '../../services/serviceService';
import {pickImage} from '../../utils/imageHelper';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

const AddServiceScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('haircut');
  const [gender, setGender] = useState('unisex');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['haircut', 'beard', 'other'];

  const handleImagePick = async () => {
    const selectedImage = await pickImage(false, false); // Don't include base64
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (parseInt(duration) < 15) {
      Alert.alert('Error', 'Duration must be at least 15 minutes');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('gender', gender);
      formData.append('price', parseInt(price));
      formData.append('duration', parseInt(duration));

      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || 'service.jpg',
        });
      }

      await serviceService.createService(formData);
      Alert.alert('Success', 'Service added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Add Service" subtitle="Create a new service" showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}
          className="flex-1 px-4 py-6">
          <Input
            label="Service Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Haircut & Styling"
            icon="cut-outline"
            style={{marginBottom: 16}}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the service"
            multiline
            numberOfLines={3}
            style={{marginBottom: 16}}
          />

          <Text className="text-text-secondary text-sm font-medium mb-2">
            Category *
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4">
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  category === cat ? 'bg-gold-500' : 'bg-dark-200'
                }`}>
                <Text
                  className={`text-sm font-semibold capitalize ${
                    category === cat ? 'text-white' : 'text-text-secondary'
                  }`}>
                  {cat.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text className="text-text-secondary text-sm font-medium mb-2">
            Gender *
          </Text>
          <View className="flex-row mb-4">
            {['male', 'unisex'].map(g => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                className={`flex-1 py-3 rounded-xl mr-2 ${
                  gender === g ? 'bg-gold-500' : 'bg-dark-200'
                }`}>
                <Text
                  className={`text-center font-semibold capitalize ${
                    gender === g ? 'text-white' : 'text-text-secondary'
                  }`}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row space-x-3 mb-4">
            <Input
              label="Price (₹) *"
              value={price}
              onChangeText={setPrice}
              placeholder="500"
              keyboardType="numeric"
              icon="pricetag-outline"
              style={{flex: 1}}
            />
            <Input
              label="Duration (mins) *"
              value={duration}
              onChangeText={setDuration}
              placeholder="30"
              keyboardType="numeric"
              icon="time-outline"
              style={{flex: 1}}
            />
          </View>

          <Text className="text-text-secondary text-sm font-medium mb-2">
            Service Image
          </Text>
          <Card variant="glass" style={{marginBottom: 24}}>
            <TouchableOpacity
              onPress={handleImagePick}
              className="items-center py-4">
              {image ? (
                <View className="items-center w-full">
                  <Image
                    source={{uri: image.uri}}
                    className="w-full h-48 rounded-xl mb-3"
                    resizeMode="cover"
                  />
                  <Text className="text-status-success text-base font-semibold">
                    Image Selected
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    Tap to change
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-text-primary text-base font-semibold">
                    Add Service Image
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    Optional
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Card>

          <Button
            title="Add Service"
            onPress={handleSubmit}
            loading={loading}
            style={{marginBottom: 16}}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddServiceScreen;
