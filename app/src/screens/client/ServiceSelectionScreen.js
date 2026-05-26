import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {serviceService} from '../../services/serviceService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const ServiceSelectionScreen = ({route, navigation}) => {
  const {salonId, salonName} = route.params;
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceService.getSalonServices(salonId);
      setServices(response.data.services);
    } catch (error) {
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const toggleService = serviceId => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const getTotalPrice = () => {
    return services
      .filter(s => selectedServices.includes(s._id))
      .reduce((sum, s) => sum + s.price, 0);
  };

  const getTotalDuration = () => {
    return services
      .filter(s => selectedServices.includes(s._id))
      .reduce((sum, s) => sum + s.duration, 0);
  };

  const handleContinue = () => {
    if (selectedServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }

    navigation.navigate('TimeSlot', {
      salonId,
      salonName,
      serviceIds: selectedServices,
      totalPrice: getTotalPrice(),
      totalDuration: getTotalDuration(),
    });
  };

  const filteredServices =
    filter === 'all'
      ? services
      : services.filter(s => s.gender === filter || s.gender === 'unisex');

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Select Services" subtitle={salonName} showBack />

      <View className="flex-row px-4 py-3 space-x-2">
        {['all', 'male'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 rounded-full ${
              filter === f ? 'bg-gold-500' : 'bg-dark-200'
            }`}>
            <Text
              className={`text-sm font-semibold ${
                filter === f ? 'text-white' : 'text-text-secondary'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {filteredServices.map(service => {
          const isSelected = selectedServices.includes(service._id);
          return (
            <TouchableOpacity
              key={service._id}
              onPress={() => toggleService(service._id)}
              activeOpacity={0.8}>
              <Card
                variant="glass"
                style={{
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? colors.gold.primary
                    : 'transparent',
                }}>
                <View className="flex-row items-center">
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected
                        ? 'bg-gold-500 border-gold-500'
                        : 'border-text-tertiary'
                    }`}>
                    {isSelected && (
                      <Icon name="checkmark" size={16} color={colors.white} />
                    )}
                  </View>

                  <View className="flex-1 ml-3">
                    <Text className="text-text-primary text-base font-semibold">
                      {service.name}
                    </Text>
                    {service.description && (
                      <Text className="text-text-tertiary text-xs mt-1">
                        {service.description}
                      </Text>
                    )}
                    <View className="flex-row items-center mt-2">
                      <Icon
                        name="time-outline"
                        size={14}
                        color={colors.text.tertiary}
                      />
                      <Text className="text-text-tertiary text-xs ml-1">
                        {service.duration} mins
                      </Text>
                      <View className="w-1 h-1 rounded-full bg-text-tertiary mx-2" />
                      <Text className="text-text-tertiary text-xs">
                        {service.gender}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-gold-500 text-lg font-bold ml-4">
                    ₹{service.price}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedServices.length > 0 && (
        <View className="px-4 py-4 bg-dark-secondary border-t border-dark-tertiary">
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-text-secondary text-sm">
                {selectedServices.length} service(s) • {getTotalDuration()} mins
              </Text>
              <Text className="text-gold-500 text-xl font-bold mt-1">
                ₹{getTotalPrice()}
              </Text>
            </View>
          </View>
          <Button title="Continue" onPress={handleContinue} />
        </View>
      )}
    </View>
  );
};

export default ServiceSelectionScreen;
