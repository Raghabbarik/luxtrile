import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {bookingService} from '../../services/bookingService';
import {formatDate, formatTime} from '../../utils/dateHelper';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const BookingConfirmationScreen = ({route, navigation}) => {
  const {bookingId} = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      const response = await bookingService.getBookingById(bookingId);
      setBooking(response.data.booking);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <ScrollView
        className="flex-1 px-4 py-12"
        showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-status-success items-center justify-center mb-4">
            <Icon name="checkmark" size={48} color={colors.white} />
          </View>
          <Text className="text-text-primary text-2xl font-bold mb-2">
            Booking Confirmed!
          </Text>
          <Text className="text-text-secondary text-base text-center">
            Your appointment has been successfully booked
          </Text>
        </View>

        <Card variant="glass" style={{marginBottom: 16}}>
          <Text className="text-text-primary text-lg font-bold mb-4">
            Booking Details
          </Text>

          <View className="flex-row items-center mb-3">
            <Icon name="business-outline" size={20} color={colors.gold.primary} />
            <Text className="text-text-secondary text-sm ml-3 flex-1">
              {booking?.salon?.name}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Icon name="calendar-outline" size={20} color={colors.gold.primary} />
            <Text className="text-text-secondary text-sm ml-3">
              {formatDate(new Date(booking?.bookingDate))}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Icon name="time-outline" size={20} color={colors.gold.primary} />
            <Text className="text-text-secondary text-sm ml-3">
              {formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Icon name="pricetag-outline" size={20} color={colors.gold.primary} />
            <Text className="text-text-secondary text-sm ml-3">
              ₹{booking?.totalAmount}
            </Text>
          </View>
        </Card>

        <Card variant="glass" style={{marginBottom: 16}}>
          <Text className="text-text-primary text-base font-bold mb-3">
            Services
          </Text>
          {booking?.services?.map((item, index) => (
            <View key={index} className="mb-2">
              <Text className="text-text-secondary text-sm">
                • {item.service.name}
              </Text>
            </View>
          ))}
        </Card>

        <Card variant="glass">
          <View className="flex-row items-start">
            <Icon
              name="information-circle-outline"
              size={20}
              color={colors.gold.primary}
            />
            <View className="flex-1 ml-3">
              <Text className="text-text-primary text-sm font-semibold mb-1">
                Important
              </Text>
              <Text className="text-text-tertiary text-xs leading-5">
                Please arrive 5 minutes before your appointment time. You can
                view and manage your booking in the Bookings tab.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <View className="px-4 py-4 bg-dark-secondary border-t border-dark-tertiary">
        <Button
          title="View My Bookings"
          onPress={() => navigation.navigate('Bookings')}
        />
        <Button
          title="Back to Home"
          variant="outline"
          onPress={() => navigation.navigate('Home')}
          style={{marginTop: 12}}
        />
      </View>
    </View>
  );
};

export default BookingConfirmationScreen;
