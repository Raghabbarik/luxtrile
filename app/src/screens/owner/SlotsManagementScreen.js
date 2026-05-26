import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {salonService} from '../../services/salonService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

const SlotsManagementScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [salon, setSalon] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [slotDuration, setSlotDuration] = useState(30);
  const [seatsPerSlot, setSeatsPerSlot] = useState(3);

  const days = [
    {key: 'monday', label: 'Mon'},
    {key: 'tuesday', label: 'Tue'},
    {key: 'wednesday', label: 'Wed'},
    {key: 'thursday', label: 'Thu'},
    {key: 'friday', label: 'Fri'},
    {key: 'saturday', label: 'Sat'},
    {key: 'sunday', label: 'Sun'},
  ];

  useEffect(() => {
    loadSalonData();
  }, []);

  const loadSalonData = async () => {
    try {
      setLoading(true);
      const response = await salonService.getMySalon();
      setSalon(response.data.salon);
      
      // Load existing slot config if available
      if (response.data.salon.slotConfig) {
        setSlotDuration(response.data.salon.slotConfig.duration || 30);
        setSeatsPerSlot(response.data.salon.slotConfig.seatsPerSlot || 3);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load salon data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSalonData();
    setRefreshing(false);
  };

  const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeStr);
      
      currentMin += duration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }
    
    return slots;
  };

  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      
      const slotConfig = {
        duration: slotDuration,
        seatsPerSlot: seatsPerSlot,
      };

      await salonService.updateSlotConfig(slotConfig);
      Alert.alert('Success', 'Slot configuration saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !refreshing) {
    return <Loading />;
  }

  if (!salon) {
    return (
      <View className="flex-1 bg-dark-primary items-center justify-center">
        <Text className="text-text-secondary">No salon found</Text>
      </View>
    );
  }

  const daySchedule = salon.workingHours?.[selectedDay];
  const timeSlots = daySchedule?.isOpen
    ? generateTimeSlots(daySchedule.openTime, daySchedule.closeTime, slotDuration)
    : [];

  return (
    <View className="flex-1 bg-dark-primary">
      <Header
        title="Slot Management"
        subtitle="Configure booking slots"
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 120}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold.primary}
          />
        }>
        <View className="px-4 py-6">
          {/* Slot Configuration */}
          <Card variant="glass" style={{marginBottom: 16}}>
            <Text className="text-text-primary text-lg font-bold mb-4">
              Slot Configuration
            </Text>

            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">
                Slot Duration (minutes)
              </Text>
              <View className="flex-row">
                {[15, 30, 45, 60].map(duration => (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => setSlotDuration(duration)}
                    className={`flex-1 py-3 rounded-xl mr-2 ${
                      slotDuration === duration ? 'bg-gold-500' : 'bg-dark-200'
                    }`}>
                    <Text
                      className={`text-center font-semibold ${
                        slotDuration === duration ? 'text-white' : 'text-text-secondary'
                      }`}>
                      {duration}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-text-secondary text-sm mb-2">
                Seats Per Slot
              </Text>
              <View className="flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => setSeatsPerSlot(Math.max(1, seatsPerSlot - 1))}
                  className="w-12 h-12 rounded-xl bg-dark-200 items-center justify-center">
                  <Icon name="remove" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                
                <View className="flex-1 mx-4 bg-dark-200 rounded-xl py-3">
                  <Text className="text-center text-text-primary text-2xl font-bold">
                    {seatsPerSlot}
                  </Text>
                </View>
                
                <TouchableOpacity
                  onPress={() => setSeatsPerSlot(Math.min(10, seatsPerSlot + 1))}
                  className="w-12 h-12 rounded-xl bg-dark-200 items-center justify-center">
                  <Icon name="add" size={24} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Save Configuration"
              onPress={handleSaveConfig}
              size="small"
            />
          </Card>

          {/* Day Selector */}
          <Text className="text-text-primary text-lg font-bold mb-3">
            Preview Slots
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4">
            {days.map(day => (
              <TouchableOpacity
                key={day.key}
                onPress={() => setSelectedDay(day.key)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  selectedDay === day.key ? 'bg-gold-500' : 'bg-dark-200'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    selectedDay === day.key ? 'text-white' : 'text-text-secondary'
                  }`}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Slots Preview */}
          {daySchedule?.isOpen ? (
            <Card variant="glass">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-text-primary text-base font-bold">
                  {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Slots
                </Text>
                <Text className="text-text-tertiary text-xs">
                  {daySchedule.openTime} - {daySchedule.closeTime}
                </Text>
              </View>

              <View className="flex-row flex-wrap">
                {timeSlots.map((slot, index) => (
                  <View
                    key={index}
                    className="w-[30%] mr-[3%] mb-3 bg-dark-200 rounded-xl p-3">
                    <View className="flex-row items-center justify-between">
                      <Icon name="time-outline" size={16} color={colors.gold.primary} />
                      <Text className="text-text-primary text-xs font-bold">
                        {slot}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-2">
                      <Icon name="people-outline" size={14} color={colors.text.tertiary} />
                      <Text className="text-text-tertiary text-xs ml-1">
                        {seatsPerSlot} seats
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View className="mt-4 pt-4 border-t border-dark-tertiary">
                <Text className="text-text-tertiary text-xs text-center">
                  Total {timeSlots.length} slots • {timeSlots.length * seatsPerSlot} bookings possible
                </Text>
              </View>
            </Card>
          ) : (
            <Card variant="glass">
              <View className="items-center py-8">
                <Icon name="close-circle-outline" size={48} color={colors.text.tertiary} />
                <Text className="text-text-secondary text-base font-bold mt-4">
                  Closed on {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                </Text>
                <Text className="text-text-tertiary text-sm mt-2">
                  Update working hours in salon settings
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SlotsManagementScreen;
