import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {bookingService} from '../../services/bookingService';
import {formatDate, getDayName} from '../../utils/dateHelper';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const TimeSlotScreen = ({route, navigation}) => {
  const {salonId, salonName, serviceIds, totalPrice, totalDuration, staffId, staffName} =
    route.params;
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    loadTimeSlots();
  }, [selectedDate]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Use new salon slots API
      const response = await bookingService.getSalonAvailableSlots(salonId, dateStr);
      
      if (response.data.slots) {
        // Filter only available slots
        const available = response.data.slots
          .filter(slot => slot.isAvailable)
          .map(slot => ({
            time: slot.time,
            availableSeats: slot.availableSeats,
            totalSeats: slot.totalSeats
          }));
        setAvailableSlots(available);
        setIsOpen(available.length > 0 || response.data.slots.length > 0);
      } else {
        setAvailableSlots([]);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to load slots:', error);
      Alert.alert('Error', 'Failed to load time slots');
      setAvailableSlots([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    navigation.navigate('Payment', {
      salonId,
      salonName,
      serviceIds,
      bookingDate: selectedDate.toISOString().split('T')[0],
      startTime: selectedSlot,
      totalPrice,
      totalDuration,
      staffId,
      staffName,
    });
  };

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatTime = time => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Select Date & Time" subtitle={salonName} showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 200}}>
        <View className="px-4 py-6">
          <Card variant="glass" style={{marginBottom: 24}}>
            <Text className="text-text-primary text-lg font-bold mb-4">
              Select Date
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4">
              {getNextDays().map((date, index) => {
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDate(date)}
                    className={`mr-3 px-4 py-3 rounded-xl items-center ${
                      isSelected ? 'bg-gold-500' : 'bg-dark-tertiary'
                    }`}
                    style={{minWidth: 80}}>
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? 'text-white' : 'text-text-tertiary'
                      }`}>
                      {getDayName(date).slice(0, 3)}
                    </Text>
                    <Text
                      className={`text-2xl font-bold mt-1 ${
                        isSelected ? 'text-white' : 'text-text-primary'
                      }`}>
                      {date.getDate()}
                    </Text>
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? 'text-white' : 'text-text-tertiary'
                      }`}>
                      {date.toLocaleString('default', {month: 'short'})}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-center py-3 bg-dark-tertiary rounded-xl">
              <Icon name="calendar-outline" size={20} color={colors.gold.primary} />
              <Text className="text-text-primary text-sm font-medium ml-2">
                Choose Custom Date
              </Text>
            </TouchableOpacity>
          </Card>

          <Card variant="glass">
            <Text className="text-text-primary text-lg font-bold mb-4">
              Available Time Slots
            </Text>

            {loading ? (
              <View className="py-12">
                <Loading message="Loading slots..." />
              </View>
            ) : !isOpen ? (
              <View className="items-center py-6">
                <Icon
                  name="close-circle-outline"
                  size={48}
                  color={colors.status.error}
                />
                <Text className="text-text-primary text-base font-semibold mt-3">
                  Salon Closed
                </Text>
                <Text className="text-text-tertiary text-sm mt-1">
                  This salon is closed on selected date
                </Text>
              </View>
            ) : availableSlots.length === 0 ? (
              <View className="items-center py-6">
                <Icon
                  name="time-outline"
                  size={48}
                  color={colors.text.tertiary}
                />
                <Text className="text-text-primary text-base font-semibold mt-3">
                  No Slots Available
                </Text>
                <Text className="text-text-tertiary text-sm mt-1">
                  Try selecting a different date
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {availableSlots.map((slot, index) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedSlot(slot.time)}
                      style={{width: '48%', marginBottom: 12}}
                      className={`px-4 py-3 rounded-xl ${
                        isSelected ? 'bg-gold-500' : 'bg-dark-tertiary'
                      }`}>
                      <View className="flex-row items-center">
                        <Icon 
                          name="time-outline" 
                          size={16} 
                          color={isSelected ? colors.white : colors.gold.primary} 
                        />
                        <Text
                          className={`text-sm font-semibold ml-2 ${
                            isSelected ? 'text-white' : 'text-text-primary'
                          }`}>
                          {formatTime(slot.time)}
                        </Text>
                      </View>
                      <View className="flex-row items-center mt-1">
                        <Icon 
                          name="people-outline" 
                          size={12} 
                          color={isSelected ? colors.white : colors.text.tertiary} 
                        />
                        <Text
                          className={`text-xs ml-1 ${
                            isSelected ? 'text-white/80' : 'text-text-tertiary'
                          }`}>
                          {slot.availableSeats}/{slot.totalSeats} seats
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Card>
        </View>
      </ScrollView>

      {selectedSlot && (
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
                {formatDate(selectedDate)} • {formatTime(selectedSlot)}
              </Text>
              <Text className="text-gold-500 text-2xl font-bold">
                ₹{totalPrice}
              </Text>
            </View>
            <View className="ml-4" style={{minWidth: 140}}>
              <Button title="Continue" onPress={handleContinue} size="medium" />
            </View>
          </View>
        </View>
      )}

      <DatePicker
        modal
        open={showDatePicker}
        date={selectedDate}
        mode="date"
        minimumDate={new Date()}
        onConfirm={date => {
          setShowDatePicker(false);
          setSelectedDate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};

export default TimeSlotScreen;
