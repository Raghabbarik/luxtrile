import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {staffService} from '../../services/staffService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const StaffSelectionScreen = ({route, navigation}) => {
  const {salonId, salonName, serviceIds, totalPrice, totalDuration} = route.params;
  const insets = useSafeAreaInsets();
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getSalonStaff(salonId);
      setStaff(response.data.staff.filter(s => s.isAvailable));
    } catch (error) {
      console.error('Failed to load staff:', error);
      Alert.alert('Error', 'Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedStaff) {
      Alert.alert('Select Staff', 'Please select a staff member to continue');
      return;
    }

    navigation.navigate('TimeSlot', {
      salonId,
      salonName,
      serviceIds,
      staffId: selectedStaff._id,
      staffName: selectedStaff.name,
      totalPrice,
      totalDuration,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Select Your Stylist" subtitle={salonName} showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 16, paddingBottom: 200}}>
        {staff.map((member) => {
          const isSelected = selectedStaff?._id === member._id;
          return (
            <TouchableOpacity
              key={member._id}
              onPress={() => setSelectedStaff(member)}
              activeOpacity={0.7}>
              <Card
                variant="glass"
                className={`mb-4 p-5 ${
                  isSelected ? 'border-2 border-gold-500 bg-gold-500/10' : 'border border-dark-light/10'
                }`}>
                <View className="flex-row items-center">
                  <View className="relative">
                    <FastImage
                      source={{
                        uri: member.profileImage || 'https://via.placeholder.com/100',
                        priority: FastImage.priority.normal,
                      }}
                      className="w-20 h-20 rounded-full"
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    {isSelected && (
                      <View className="absolute -top-1 -right-1 bg-gold-500 w-6 h-6 rounded-full items-center justify-center">
                        <Icon name="checkmark" size={16} color={colors.white} />
                      </View>
                    )}
                  </View>

                  <View className="flex-1 ml-4">
                    <Text className="text-white text-lg font-bold mb-1">
                      {member.name}
                    </Text>
                    <Text className="text-text-secondary text-sm mb-2">
                      {member.role}
                    </Text>

                    <View className="flex-row items-center">
                      <Icon name="star" size={14} color={colors.gold.primary} />
                      <Text className="text-text-secondary text-xs ml-1">
                        {member.rating.average.toFixed(1)}
                      </Text>
                      <Text className="text-text-tertiary text-xs ml-3">
                        {member.totalBookings} bookings
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected
                        ? 'border-gold-500 bg-gold-500'
                        : 'border-dark-light/30'
                    }`}>
                    {isSelected && (
                      <Icon name="checkmark" size={14} color={colors.white} />
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {staff.length === 0 && (
          <EmptyState
            icon="people-outline"
            title="No Staff Available"
            message="No staff members are currently available"
          />
        )}
      </ScrollView>

      {selectedStaff && (
        <View
          className="px-6 py-5 bg-dark-primary border-t border-dark-tertiary absolute left-0 right-0"
          style={{
            bottom: 68 + insets.bottom,
            paddingBottom: 20,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -4},
            shadowOpacity: 0.5,
            shadowRadius: 12,
          }}>
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-text-secondary text-xs mb-1">
                Selected Stylist
              </Text>
              <Text className="text-white text-lg font-bold">
                {selectedStaff.name}
              </Text>
            </View>
            <View className="ml-4" style={{minWidth: 140}}>
              <Button
                title="Continue"
                onPress={handleContinue}
                size="medium"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default StaffSelectionScreen;
