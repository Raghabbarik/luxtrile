import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../../theme/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SalonDetailsScreen = ({navigation, route}) => {
  const {ownerData} = route.params;
  const [salonName, setSalonName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [images, setImages] = useState([]);

  const pickImages = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 5,
      quality: 0.8,
    });

    if (result.assets) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = index => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (!salonName || !address || !city || !state || !pincode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please upload at least one salon photo');
      return;
    }

    navigation.navigate('Salon360View', {
      ownerData,
      salonData: {salonName, address, city, state, pincode, images},
    });
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
              Salon Details
            </Text>
            <Text className="text-text-secondary text-base">
              Step 2 of 4 - Upload Photos
            </Text>
          </View>

          <View
            className="p-6 rounded-[32px] border-[1px] border-dark-light/10 mb-6"
            style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
            <Input
              label="Salon Name"
              value={salonName}
              onChangeText={setSalonName}
              placeholder="Luxury Beauty Salon"
              icon="business-outline"
            />

            <Input
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main Street"
              icon="location-outline"
              style={{marginTop: 16}}
            />

            <View className="flex-row space-x-3 mt-4">
              <Input
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="New York"
                style={{flex: 1}}
              />
              <Input
                label="State"
                value={state}
                onChangeText={setState}
                placeholder="NY"
                style={{flex: 1}}
              />
            </View>

            <Input
              label="Pincode"
              value={pincode}
              onChangeText={setPincode}
              placeholder="10001"
              keyboardType="numeric"
              icon="pin-outline"
              style={{marginTop: 16}}
            />

            <View className="mt-6">
              <Text className="text-text-secondary text-sm font-bold mb-3">
                Salon Photos (Max 5)
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((img, index) => (
                  <View key={index} className="mr-3 relative" style={{overflow: 'visible'}}>
                    <Image
                      source={{uri: img.uri}}
                      className="w-24 h-24 rounded-2xl"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#EF4444',
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}>
                      <Icon name="close" size={16} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < 5 && (
                  <TouchableOpacity
                    onPress={pickImages}
                    className="w-24 h-24 rounded-2xl border-2 border-dashed border-gold-500 items-center justify-center bg-gold-soft">
                    <Icon name="camera" size={32} color={colors.gold.primary} />
                    <Text className="text-gold-500 text-xs mt-1 font-bold">
                      Add Photo
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            <Button
              title="Continue"
              onPress={handleContinue}
              style={{marginTop: 24}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SalonDetailsScreen;
