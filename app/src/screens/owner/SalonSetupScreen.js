import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {salonService} from '../../services/salonService';
import {pickImage} from '../../utils/imageHelper';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Loading from '../../components/Loading';

const FORM_DATA_KEY = '@salon_setup_form_data';

const SalonSetupScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [salonId, setSalonId] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existing360Images, setExisting360Images] = useState([]);
  const [new360Images, setNew360Images] = useState([]);
  const [view360Video, setView360Video] = useState('');

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        setLoading(true);
        const response = await salonService.getMySalon();
        const salon = response.data.salon;
        
        // Salon exists - load data
        console.log('Loaded salon data:', salon);
        setIsEdit(true);
        setSalonId(salon._id);
        setName(salon.name);
        setDescription(salon.description || '');
        setPhone(salon.phone);
        setEmail(salon.email || '');
        setStreet(salon.address.street);
        setCity(salon.address.city);
        setState(salon.address.state);
        setPincode(salon.address.pincode);
        setExistingImages(salon.images || []);
        setExisting360Images(salon.view360?.images || []);
        setView360Video(salon.view360?.video || '');
        
        console.log('Images loaded:', salon.images?.length || 0);
      } catch (error) {
        // No salon exists - load saved form data
        console.log('No salon found, loading saved form data');
        setIsEdit(false);
        await loadSavedFormData();
      } finally {
        setLoading(false);
      }
    };
    
    initializeScreen();
  }, []);

  useEffect(() => {
    // Auto-save form data whenever it changes (only for new salon)
    if (!isEdit && !loading) {
      saveFormData();
    }
  }, [name, description, phone, email, street, city, state, pincode, view360Video, isEdit, loading]);

  const loadSavedFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(FORM_DATA_KEY);
      if (savedData && !isEdit) {
        const data = JSON.parse(savedData);
        setName(data.name || '');
        setDescription(data.description || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setStreet(data.street || '');
        setCity(data.city || '');
        setState(data.state || '');
        setPincode(data.pincode || '');
        setView360Video(data.view360Video || '');
        console.log('Loaded saved form data');
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  };

  const saveFormData = async () => {
    try {
      if (!isEdit) {
        const formData = {
          name,
          description,
          phone,
          email,
          street,
          city,
          state,
          pincode,
          view360Video,
        };
        await AsyncStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const clearSavedFormData = async () => {
    try {
      await AsyncStorage.removeItem(FORM_DATA_KEY);
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  };

  const loadSalonData = async () => {
    // This function is no longer needed - merged into useEffect
  };

  const handleImagePick = async () => {
    const image = await pickImage(true, false);
    if (image) {
      if (Array.isArray(image)) {
        setNewImages([...newImages, ...image]);
      } else {
        setNewImages([...newImages, image]);
      }
    }
  };

  const removeExistingImage = (index) => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = [...existingImages];
            updated.splice(index, 1);
            setExistingImages(updated);
          },
        },
      ]
    );
  };

  const removeNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handle360ImagePick = async () => {
    const image = await pickImage(true, false);
    if (image) {
      if (Array.isArray(image)) {
        setNew360Images([...new360Images, ...image]);
      } else {
        setNew360Images([...new360Images, image]);
      }
    }
  };

  const removeExisting360Image = (index) => {
    Alert.alert(
      'Remove 360 Image',
      'Are you sure you want to remove this 360 image?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = [...existing360Images];
            updated.splice(index, 1);
            setExisting360Images(updated);
          },
        },
      ]
    );
  };

  const removeNew360Image = (index) => {
    const updated = [...new360Images];
    updated.splice(index, 1);
    setNew360Images(updated);
  };

  const handleSubmit = async () => {
    if (!name || !phone || !street || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', JSON.stringify({street, city, state, pincode, country: 'India'}));
      
      // Add existing images
      formData.append('images', JSON.stringify(existingImages));
      
      // Add new images as files
      newImages.forEach((img, index) => {
        formData.append('newImages', {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.fileName || `salon_${index}.jpg`,
        });
      });

      // Add 360 view data
      formData.append('view360Images', JSON.stringify(existing360Images));
      formData.append('view360Video', view360Video);
      
      // Add new 360 images
      new360Images.forEach((img, index) => {
        formData.append('new360Images', {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.fileName || `360_${index}.jpg`,
        });
      });

      if (isEdit) {
        await salonService.updateSalon(formData);
        Alert.alert('Success', 'Salon updated successfully');
      } else {
        await salonService.createSalon(formData);
        await clearSavedFormData(); // Clear saved data after successful creation
        Alert.alert('Success', 'Salon created successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save salon',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header
        title={isEdit ? 'Edit Salon' : 'Setup Salon'}
        subtitle="Configure your salon details"
        showBack
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}
          className="flex-1 px-4 py-6">
          <Input
            label="Salon Name *"
            value={name}
            onChangeText={setName}
            placeholder="Enter salon name"
            icon="business-outline"
            style={{marginBottom: 16}}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of your salon"
            multiline
            numberOfLines={3}
            style={{marginBottom: 16}}
          />

          <Input
            label="Phone *"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            icon="call-outline"
            style={{marginBottom: 16}}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            icon="mail-outline"
            style={{marginBottom: 16}}
          />

          <Text className="text-text-primary text-lg font-bold mb-4">
            Address
          </Text>

          <Input
            label="Street *"
            value={street}
            onChangeText={setStreet}
            placeholder="Enter street address"
            icon="location-outline"
            style={{marginBottom: 16}}
          />

          <View className="flex-row space-x-3 mb-4">
            <Input
              label="City *"
              value={city}
              onChangeText={setCity}
              placeholder="City"
              style={{flex: 1}}
            />
            <Input
              label="State *"
              value={state}
              onChangeText={setState}
              placeholder="State"
              style={{flex: 1}}
            />
          </View>

          <Input
            label="Pincode *"
            value={pincode}
            onChangeText={setPincode}
            placeholder="Enter pincode"
            keyboardType="numeric"
            style={{marginBottom: 24}}
          />

          <Text className="text-text-primary text-lg font-bold mb-4">
            Salon Images
          </Text>

          {/* Debug info */}
          {__DEV__ && (
            <Text className="text-text-tertiary text-xs mb-2">
              Debug: Existing: {existingImages.length}, New: {newImages.length}
            </Text>
          )}

          {/* Existing Images */}
          {existingImages.length > 0 ? (
            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">
                Current Images ({existingImages.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {existingImages.map((img, index) => (
                  <View key={`existing-${index}`} className="mr-3 relative">
                    <Image
                      source={{uri: img}}
                      className="w-32 h-32 rounded-xl"
                      resizeMode="cover"
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                    <TouchableOpacity
                      onPress={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-status-error w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                      }}>
                      <Icon name="close" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View className="mb-4">
              <Card variant="glass" className="p-4">
                <Text className="text-text-tertiary text-sm text-center">
                  No existing images found
                </Text>
              </Card>
            </View>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">
                New Images ({newImages.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {newImages.map((img, index) => (
                  <View key={index} className="mr-3 relative">
                    <Image
                      source={{uri: img.uri}}
                      className="w-32 h-32 rounded-xl"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-status-error w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                      }}>
                      <Icon name="close" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <Card variant="glass" style={{marginBottom: 24}}>
            <TouchableOpacity
              onPress={handleImagePick}
              className="items-center py-6">
              <Icon name="images-outline" size={32} color={colors.gold.primary} />
              <Text className="text-text-primary text-base font-semibold mt-2">
                Add More Images
              </Text>
              <Text className="text-text-tertiary text-xs mt-1">
                Tap to select images
              </Text>
            </TouchableOpacity>
          </Card>

          {/* 360 View Section */}
          <Text className="text-text-primary text-lg font-bold mb-4 mt-6">
            360° Virtual Tour
          </Text>

          {/* Existing 360 Images */}
          {existing360Images.length > 0 && (
            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">
                Current 360° Images ({existing360Images.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {existing360Images.map((img, index) => (
                  <View key={`360-existing-${index}`} className="mr-3 relative">
                    <Image
                      source={{uri: img}}
                      className="w-32 h-32 rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="absolute top-1 left-1 bg-gold-500 px-2 py-1 rounded-lg">
                      <Text className="text-white text-xs font-bold">360°</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeExisting360Image(index)}
                      className="absolute top-2 right-2 bg-status-error w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                      }}>
                      <Icon name="close" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* New 360 Images */}
          {new360Images.length > 0 && (
            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">
                New 360° Images ({new360Images.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {new360Images.map((img, index) => (
                  <View key={`360-new-${index}`} className="mr-3 relative">
                    <Image
                      source={{uri: img.uri}}
                      className="w-32 h-32 rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="absolute top-1 left-1 bg-gold-500 px-2 py-1 rounded-lg">
                      <Text className="text-white text-xs font-bold">360°</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeNew360Image(index)}
                      className="absolute top-2 right-2 bg-status-error w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                      }}>
                      <Icon name="close" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <Card variant="glass" style={{marginBottom: 16}}>
            <TouchableOpacity
              onPress={handle360ImagePick}
              className="items-center py-6">
              <Icon name="scan-circle-outline" size={32} color={colors.gold.primary} />
              <Text className="text-text-primary text-base font-semibold mt-2">
                Add 360° Images
              </Text>
              <Text className="text-text-tertiary text-xs mt-1">
                Panoramic view of your salon
              </Text>
            </TouchableOpacity>
          </Card>

         

          <Button
            title={isEdit ? 'Update Salon' : 'Create Salon'}
            onPress={handleSubmit}
            loading={submitting}
            style={{marginBottom: 16}}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SalonSetupScreen;
