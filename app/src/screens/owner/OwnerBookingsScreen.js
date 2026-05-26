import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {bookingService} from '../../services/bookingService';
import {formatDate, formatTime, getRelativeDate} from '../../utils/dateHelper';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const OwnerBookingsScreen = ({navigation}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, [filter]);

  useEffect(() => {
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      loadBookings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadBookings = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const status = filter === 'all' ? null : filter;
      const response = await bookingService.getSalonBookings(status);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      Alert.alert('Success', `Booking ${status} successfully`);
      await loadBookings();
    } catch (error) {
      console.error('Failed to update status:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const renderBookingCard = ({item}) => {
    const canUpdate = item.status === 'pending';
    const canComplete = item.status === 'confirmed';

    return (
      <Card variant="glass" style={{marginBottom: 16}}>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-text-primary text-lg font-bold">
              {item.client?.name || 'Unknown Client'}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon name="call-outline" size={14} color={colors.text.tertiary} />
              <Text className="text-text-tertiary text-xs ml-1">
                {item.client?.phone || 'N/A'}
              </Text>
            </View>
          </View>
          <StatusBadge status={item.status} />
        </View>

        <View className="h-px bg-dark-tertiary my-3" />

        <View className="flex-row items-center mb-2">
          <Icon name="calendar-outline" size={16} color={colors.gold.primary} />
          <Text className="text-text-secondary text-sm ml-2">
            {getRelativeDate(item.bookingDate)}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Icon name="time-outline" size={16} color={colors.gold.primary} />
          <Text className="text-text-secondary text-sm ml-2">
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Text>
        </View>

        {item.services && item.services.length > 0 && (
          <View className="flex-row items-start mb-2">
            <Icon name="cut-outline" size={16} color={colors.gold.primary} style={{marginTop: 2}} />
            <Text className="text-text-secondary text-sm ml-2 flex-1">
              {item.services.map(s => s.service?.name || s.name).join(', ')}
            </Text>
          </View>
        )}

        {item.staff && (
          <View className="flex-row items-center mb-2">
            <Icon name="person-outline" size={16} color={colors.gold.primary} />
            <Text className="text-text-secondary text-sm ml-2">
              {item.staff.name} • {item.staff.role}
            </Text>
          </View>
        )}

        <View className="flex-row items-center mb-3">
          <Icon name="pricetag-outline" size={16} color={colors.gold.primary} />
          <Text className="text-text-secondary text-sm ml-2">
            ₹{item.totalAmount}
          </Text>
        </View>

        {canUpdate && (
          <View className="flex-row" style={{gap: 8}}>
            <View style={{flex: 1}}>
              <Button
                title="Accept"
                size="small"
                onPress={() => handleUpdateStatus(item._id, 'confirmed')}
              />
            </View>
            <View style={{flex: 1}}>
              <Button
                title="Reject"
                variant="outline"
                size="small"
                onPress={() => handleUpdateStatus(item._id, 'cancelled')}
              />
            </View>
          </View>
        )}

        {canComplete && (
          <Button
            title="Mark as Completed"
            size="small"
            onPress={() => {
              Alert.alert(
                'Complete Booking',
                'Mark this booking as completed?',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Complete',
                    onPress: () => handleUpdateStatus(item._id, 'completed'),
                  },
                ]
              );
            }}
            icon={<Icon name="checkmark-circle-outline" size={18} color={colors.white} />}
          />
        )}
      </Card>
    );
  };

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Bookings" subtitle="Manage appointments" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3"
        style={{maxHeight: 60}}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 rounded-full mr-2 ${
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
      </ScrollView>

      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item._id}
        contentContainerStyle={{padding: 16, flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No Bookings Found"
            message="You don't have any bookings yet."
          />
        }
      />
    </View>
  );
};

export default OwnerBookingsScreen;
