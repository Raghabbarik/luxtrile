import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../config/api';

const SalonServicesScreen = ({navigation, route}) => {
  const {ownerData, salonData, view360Data} = route.params;
  const [services, setServices] = useState([
    {name: '', price: '', duration: ''},
  ]);
  const [loading, setLoading] = useState(false);

  const addService = () => {
    setServices([...services, {name: '', price: '', duration: ''}]);
  };

  const removeService = index => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleSubmit = async () => {
    // Validate services
    const validServices = services.filter(
      s => s.name && s.price && s.duration,
    );

    if (validServices.length === 0) {
      Alert.alert('Error', 'Please add at least one service');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Register owner
      const registerResponse = await api.post('/auth/register', {
        name: ownerData.name,
        email: ownerData.email,
        password: ownerData.password,
        phone: ownerData.phone,
        role: 'salon_owner',
      });

      const {token, user} = registerResponse.data.data;
      const userId = user.id;

      try {
        // Step 2: Create salon with images using FormData
        const formData = new FormData();
        formData.append('name', salonData.salonName);
        formData.append('description', `Premium salon in ${salonData.city}`);
        formData.append('phone', ownerData.phone);
        formData.append('email', ownerData.email);
        formData.append('address', JSON.stringify({
          street: salonData.address,
          city: salonData.city,
          state: salonData.state,
          pincode: salonData.pincode,
          country: 'India',
        }));

        // Add salon images
        if (salonData.images && salonData.images.length > 0) {
          salonData.images.forEach((img, index) => {
            formData.append('images', {
              uri: img.uri,
              type: img.type || 'image/jpeg',
              name: img.fileName || `salon_${index}.jpg`,
            });
          });
        }

        // Add 360 view data if available
        if (view360Data) {
          if (view360Data.images && view360Data.images.length > 0) {
            view360Data.images.forEach((img, index) => {
              formData.append('view360Images', {
                uri: img.uri,
                type: img.type || 'image/jpeg',
                name: img.fileName || `360_${index}.jpg`,
              });
            });
          }
          if (view360Data.videoUrl) {
            formData.append('view360Video', view360Data.videoUrl);
          }
        }

        const salonResponse = await api.post('/salons', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const salonId = salonResponse.data.data.salon._id;

        // Step 3: Add services
        const servicePromises = validServices.map(service =>
          api.post(
            '/services',
            {
              name: service.name,
              price: parseFloat(service.price),
              duration: parseInt(service.duration),
              category: 'haircut',
              gender: 'male',
            },
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          ),
        );

        await Promise.all(servicePromises);

        Alert.alert('Success', 'Salon registered successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OwnerLogin'),
          },
        ]);
      } catch (error) {
        // Rollback: Delete user if salon/service creation fails
        console.error('Salon/Service creation failed, rolling back...');
        try {
          await api.delete(`/users/${userId}`, {
            headers: {Authorization: `Bearer ${token}`},
          });
        } catch (rollbackError) {
          console.error('Rollback failed:', rollbackError);
        }
        throw error;
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-8 py-12">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-8">
            <Icon name="arrow-back" size={28} color={colors.white} />
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-white text-4xl font-bold mb-2">
              Services & Pricing
            </Text>
            <Text className="text-text-secondary text-base">
              Step 4 of 4 - Add Your Services
            </Text>
          </View>

          <View
            className="p-6 rounded-[32px] border-[1px] border-dark-light/10 mb-6"
            style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
            {services.map((service, index) => (
              <View
                key={index}
                className="mb-6 p-4 rounded-2xl bg-dark-tertiary border border-dark-light">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-text-primary text-sm font-bold">
                    Service {index + 1}
                  </Text>
                  {services.length > 1 && (
                    <TouchableOpacity onPress={() => removeService(index)}>
                      <Icon name="trash" size={20} color={colors.status.error} />
                    </TouchableOpacity>
                  )}
                </View>

                <Input
                  label="Service Name"
                  value={service.name}
                  onChangeText={value => updateService(index, 'name', value)}
                  placeholder="Haircut"
                  style={{marginBottom: 12}}
                />

                <View className="flex-row space-x-3">
                  <Input
                    label="Price (₹)"
                    value={service.price}
                    onChangeText={value => updateService(index, 'price', value)}
                    placeholder="500"
                    keyboardType="numeric"
                    style={{flex: 1}}
                  />
                  <Input
                    label="Duration (min)"
                    value={service.duration}
                    onChangeText={value =>
                      updateService(index, 'duration', value)
                    }
                    placeholder="30"
                    keyboardType="numeric"
                    style={{flex: 1}}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addService}
              className="py-4 rounded-2xl border-2 border-dashed border-gold-500 items-center bg-gold-soft mb-6">
              <Icon name="add-circle" size={32} color={colors.gold.primary} />
              <Text className="text-gold-500 text-sm font-bold mt-1">
                Add Service
              </Text>
            </TouchableOpacity>

            <Button
              title="Submit for Review"
              onPress={handleSubmit}
              loading={loading}
            />

            <Text className="text-text-tertiary text-xs text-center mt-4">
              Your salon will be reviewed by our admin team within 24-48 hours
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SalonServicesScreen;
