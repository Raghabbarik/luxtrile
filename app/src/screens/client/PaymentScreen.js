import React, {useState} from 'react';
import {View, Text, ScrollView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {bookingService} from '../../services/bookingService';
import {formatDate, formatTime} from '../../utils/dateHelper';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

const PaymentScreen = ({route, navigation}) => {
  const {
    salonId,
    salonName,
    serviceIds,
    bookingDate,
    startTime,
    totalPrice,
    totalDuration,
    staffId,
    staffName,
  } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);

      const bookingResponse = await bookingService.createBooking({
        salonId,
        serviceIds,
        bookingDate,
        startTime,
        staffId,
      });

      const booking = bookingResponse.data.booking;

      Alert.alert(
        'Booking Confirmed!',
        'Your booking has been confirmed. The salon will be notified.',
        [
          {
            text: 'View Booking',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{name: 'ClientTabs'}],
              });
              navigation.navigate('Bookings');
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Payment" subtitle="Review & Pay" showBack />

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 200}}>
        <Card variant="glass" style={{marginBottom: 16}}>
          <View className="flex-row items-center mb-4">
            <Icon name="business-outline" size={24} color={colors.gold.primary} />
            <Text className="text-text-primary text-lg font-bold ml-3">
              {salonName}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Icon name="calendar-outline" size={18} color={colors.text.tertiary} />
            <Text className="text-text-secondary text-sm ml-3">
              {formatDate(new Date(bookingDate))}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Icon name="time-outline" size={18} color={colors.text.tertiary} />
            <Text className="text-text-secondary text-sm ml-3">
              {formatTime(startTime)} • {totalDuration} mins
            </Text>
          </View>

          {staffName && (
            <View className="flex-row items-center mb-2">
              <Icon name="person-outline" size={18} color={colors.text.tertiary} />
              <Text className="text-text-secondary text-sm ml-3">
                {staffName}
              </Text>
            </View>
          )}
        </Card>

        <Card variant="glass" style={{marginBottom: 16}}>
          <Text className="text-text-primary text-base font-bold mb-3">
            Payment Summary
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary text-sm">Service Charges</Text>
            <Text className="text-text-primary text-sm font-semibold">
              ₹{totalPrice}
            </Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-text-secondary text-sm">Taxes & Fees</Text>
            <Text className="text-text-primary text-sm font-semibold">₹0</Text>
          </View>

          <View className="h-px bg-dark-tertiary my-3" />

          <View className="flex-row justify-between">
            <Text className="text-text-primary text-base font-bold">
              Total Amount
            </Text>
            <Text className="text-gold-500 text-xl font-bold">
              ₹{totalPrice}
            </Text>
          </View>
        </Card>

        
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
            <Text className="text-text-secondary text-xs mb-1">
              Total Amount
            </Text>
            <Text className="text-gold-500 text-2xl font-bold">
              ₹{totalPrice}
            </Text>
          </View>
          <View className="ml-4" style={{minWidth: 160}}>
            <Button
              title="Confirm Booking"
              onPress={handleConfirmBooking}
              loading={loading}
              size="medium"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentScreen;
