import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { salonService } from '../../services/salonService';
import { serviceService } from '../../services/serviceService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const { width } = Dimensions.get('window');

const SalonDetailsScreen = ({ route, navigation }) => {
  const { salonId } = route.params;
  const insets = useSafeAreaInsets();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    loadSalonDetails();
    loadServices();
  }, []);

  const loadSalonDetails = async () => {
    try {
      const response = await salonService.getSalonById(salonId);
      setSalon(response.data.salon);
    } catch (error) {
      // Alert.alert('Error', 'Failed to load salon details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await serviceService.getSalonServices(salonId);
      setServices(response.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  const getDaySchedule = () => {
    if (!salon) return null;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return salon.workingHours[today];
  };

  const toggleServiceSelection = (service) => {
    const isSelected = selectedServices.find(s => s._id === service._id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s._id !== service._id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  const handleProceedToBooking = () => {
    if (selectedServices.length === 0) {
      Alert.alert('Select Services', 'Please select at least one service to continue');
      return;
    }

    navigation.navigate('StaffSelection', {
      salonId: salon._id,
      salonName: salon.name,
      serviceIds: selectedServices.map(s => s._id),
      totalPrice: getTotalPrice(),
      totalDuration: getTotalDuration(),
    });
  };

  if (loading) {
    return <Loading />;
  }

  const daySchedule = getDaySchedule();

  return (
    <View className="flex-1 bg-dark-primary">
      <View className="absolute top-0 left-0 right-0 z-10">
        <Header title="" transparent showBack rightIcon="" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 240}}>
        <View className="h-[400px]">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / width,
              );
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}>
            {(salon.images && salon.images.length > 0 ? salon.images : ['https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop']).map((image, index) => (
              <FastImage
                key={index}
                source={{ uri: image, priority: FastImage.priority.high }}
                style={{ width, height: 400 }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ))}
          </ScrollView>
          <LinearGradient
            colors={['rgba(10,10,11,0.5)', 'transparent', 'rgba(10,10,11,1)']}
            className="absolute top-0 left-0 right-0 bottom-0"
          />
          <View className="absolute bottom-10 left-0 right-0 flex-row justify-center">
            {(salon.images || [1]).map((_, index) => (
              <View
                key={index}
                className={`h-1 mx-1 rounded-full ${index === activeImageIndex ? 'w-8 bg-gold-500' : 'w-4 bg-white opacity-40'
                  }`}
              />
            ))}
          </View>
        </View>

        <View className="px-6 -mt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white text-3xl font-bold tracking-tight">
                {salon.name}
              </Text>
              <View className="flex-row items-center mt-2">
                <View className="flex-row bg-gold-soft px-2 py-1 rounded-lg">
                  <Icon name="star" size={14} color={colors.gold.primary} />
                  <Text className="text-gold-500 text-xs font-bold ml-1">
                    {salon.rating.average.toFixed(1)}
                  </Text>
                </View>
                <Text className="text-text-tertiary text-xs font-medium ml-2">
                  ({salon.rating.count} Verified Reviews)
                </Text>
              </View>
            </View>
           
          </View>

          <View className="flex-row items-center mt-8 bg-dark-tertiary/40 border-[1px] border-dark-light/10 p-5 rounded-[24px]">
            <View className="flex-1">
              <View className="flex-row items-center">
                <Icon name="location-outline" size={18} color={colors.gold.primary} />
                <Text className="text-white text-sm font-bold ml-2">Location</Text>
              </View>
              <Text className="text-text-secondary text-xs mt-2 leading-5" numberOfLines={2}>
                {salon.address.street}, {salon.address.city}, {salon.address.state}
              </Text>
            </View>
            <View className="ml-4 bg-gold-500 w-12 h-12 rounded-2xl items-center justify-center">
              <Icon name="navigate" size={20} color={colors.white} />
            </View>
          </View>

          <View className="mt-8">
            <Text className="text-white text-xl font-bold mb-4">About the Studio</Text>
            <Text className="text-text-secondary text-sm leading-6">
              {salon.description || 'Welcome to our premium studio where we redefine beauty with excellence and care.'}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-10 mb-6">
            <Text className="text-white text-xl font-bold">Services</Text>
           
          </View>

          {services.length === 0 ? (
            <Card variant="glass" className="p-8 items-center">
              <Icon name="cut-outline" size={48} color={colors.text.tertiary} />
              <Text className="text-text-secondary text-base font-medium mt-4">
                No services available
              </Text>
            </Card>
          ) : (
            services.map(service => {
              const isSelected = selectedServices.find(s => s._id === service._id);
              return (
                <TouchableOpacity 
                  key={service._id}
                  onPress={() => toggleServiceSelection(service)}
                  activeOpacity={0.7}
                >
                  <Card 
                    variant="glass" 
                    className={`mb-4 p-5 ${isSelected ? 'border-2 border-gold-500 bg-gold-500/10' : 'border border-dark-light/10'}`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1 pr-4">
                        <Text className="text-white text-base font-bold">
                          {service.name}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Icon name="time-outline" size={12} color={colors.text.tertiary} />
                          <Text className="text-text-tertiary text-xs ml-1">
                            {service.duration} mins • {service.category || 'Beauty'}
                          </Text>
                        </View>
                        <Text className="text-gold-500 text-lg font-bold mt-2">
                          ₹{service.price}
                        </Text>
                      </View>
                      <View 
                        className={`${isSelected ? 'bg-gold-500' : 'bg-dark-light/20'} w-10 h-10 rounded-xl items-center justify-center border-[1px] ${isSelected ? 'border-gold-500' : 'border-dark-light/10'}`}
                      >
                        <Icon 
                          name={isSelected ? 'checkmark' : 'add'} 
                          size={24} 
                          color={isSelected ? colors.white : colors.gold.primary} 
                        />
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })
          )}

          <View className="h-24" />
        </View>
      </ScrollView>

      <View 
        className="px-6 py-5 bg-dark-primary border-t border-dark-tertiary absolute left-0 right-0" 
        style={{
          bottom: 68 + insets.bottom,
          paddingBottom: 20,
          elevation: 10, 
          shadowColor: '#000', 
          shadowOffset: {width: 0, height: -4}, 
          shadowOpacity: 0.5, 
          shadowRadius: 12
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            {selectedServices.length > 0 ? (
              <>
                <Text className="text-text-secondary text-xs mb-1">
                  {selectedServices.length} service(s) • {getTotalDuration()} mins
                </Text>
                <Text className="text-gold-500 text-2xl font-bold">
                  ₹{getTotalPrice()}
                </Text>
              </>
            ) : (
              <Text className="text-text-secondary text-sm">
                Select services to continue
              </Text>
            )}
          </View>
          <View className="ml-4" style={{minWidth: 140}}>
            <Button
              title={selectedServices.length > 0 ? "Continue" : "Select"}
              onPress={handleProceedToBooking}
              disabled={selectedServices.length === 0}
              size="medium"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default SalonDetailsScreen;
