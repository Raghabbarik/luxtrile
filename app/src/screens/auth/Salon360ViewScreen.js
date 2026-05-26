import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../../theme/colors';
import Button from '../../components/Button';

const Salon360ViewScreen = ({navigation, route}) => {
  const {ownerData, salonData} = route.params;
  const [images360, setImages360] = useState([]);
  const [video360, setVideo360] = useState(null);

  const pick360Images = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 10,
      quality: 0.8,
    });

    if (result.assets) {
      setImages360([...images360, ...result.assets]);
    }
  };

  const pick360Video = async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      setVideo360(result.assets[0]);
    }
  };

  const removeImage = index => {
    setImages360(images360.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (images360.length === 0 && !video360) {
      Alert.alert('Error', 'Please upload 360° images or video');
      return;
    }

    navigation.navigate('SalonServices', {
      ownerData,
      salonData,
      view360Data: {images360, video360},
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
              360° View
            </Text>
            <Text className="text-text-secondary text-base">
              Step 3 of 4 - Showcase Your Salon
            </Text>
          </View>

          <View
            className="p-6 rounded-[32px] border-[1px] border-dark-light/10 mb-6"
            style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
            
            <View className="mb-6">
              <Text className="text-text-secondary text-sm font-bold mb-3">
                360° Images
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images360.map((img, index) => (
                  <View key={index} className="mr-3 relative">
                    <Image
                      source={{uri: img.uri}}
                      className="w-32 h-32 rounded-2xl"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center">
                      <Icon name="close" size={14} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={pick360Images}
                  className="w-32 h-32 rounded-2xl border-2 border-dashed border-gold-500 items-center justify-center bg-gold-soft">
                  <Icon name="images" size={32} color={colors.gold.primary} />
                  <Text className="text-gold-500 text-xs mt-1 font-bold">
                    Add Images
                  </Text>
                </TouchableOpacity>
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

export default Salon360ViewScreen;
