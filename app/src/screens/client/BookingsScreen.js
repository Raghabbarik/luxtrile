import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {colors} from '../../theme/colors';
import {bookingService} from '../../services/bookingService';
import {formatDate, formatTime, getRelativeDate} from '../../utils/dateHelper';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const BookingsScreen = ({navigation}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [filter]);

  useEffect(() => {
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      loadBookings();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadBookings = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      const status = filter === 'all' ? null : filter;
      const response = await bookingService.getMyBookings(status);
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

  const handleCancelBooking = booking => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      Alert.alert('Error', 'Please provide a cancellation reason');
      return;
    }

    try {
      setCancelling(true);
      await bookingService.cancelBooking(
        selectedBooking._id,
        cancellationReason,
      );
      setShowCancelModal(false);
      setCancellationReason('');
      setSelectedBooking(null);
      Alert.alert('Success', 'Booking cancelled successfully');
      await loadBookings();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  const renderBookingCard = ({item}) => {
    const canCancel =
      item.status === 'pending' || item.status === 'confirmed';
    const canReview = item.status === 'completed' && !item.review;

    return (
      <Card variant="glass" style={{marginBottom: 16}}>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-text-primary text-lg font-bold">
              {item.salon?.name || 'Salon'}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon
                name="location-outline"
                size={14}
                color={colors.text.tertiary}
              />
              <Text className="text-text-tertiary text-xs ml-1">
                {item.salon?.address?.city || 'N/A'}
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

        <View className="flex-row" style={{gap: 8}}>
          <View style={{flex: 1}}>
            <Button
              title="View Details"
              variant="outline"
              size="small"
              onPress={() =>
                navigation.navigate('BookingDetails', {bookingId: item._id})
              }
            />
          </View>
          {canCancel && (
            <View style={{flex: 1}}>
              <Button
                title="Cancel"
                variant="outline"
                size="small"
                onPress={() => handleCancelBooking(item)}
              />
            </View>
          )}
          {canReview && (
            <View style={{flex: 1}}>
              <Button
                title="Review"
                size="small"
                onPress={() =>
                  navigation.navigate('BookingDetails', {bookingId: item._id})
                }
                icon={<Icon name="star-outline" size={16} color={colors.white} />}
              />
            </View>
          )}
        </View>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="My Bookings" subtitle="Manage your appointments" />

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
            message="You don't have any bookings yet. Start exploring salons!"
            actionText="Browse Salons"
            onAction={() => navigation.navigate('Home')}
          />
        }
      />

      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowCancelModal(false);
          setCancellationReason('');
          setSelectedBooking(null);
        }}>
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => {
            setShowCancelModal(false);
            setCancellationReason('');
            setSelectedBooking(null);
          }}
          className="flex-1 justify-end"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-dark-secondary rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-text-primary text-xl font-bold">
                  Cancel Booking
                </Text>
                <TouchableOpacity onPress={() => {
                  setShowCancelModal(false);
                  setCancellationReason('');
                  setSelectedBooking(null);
                }}>
                  <Icon name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <Text className="text-text-secondary text-sm mb-4">
                Please provide a reason for cancellation:
              </Text>

              <View className="bg-dark-200 rounded-xl p-4 mb-4">
                <TextInput
                  value={cancellationReason}
                  onChangeText={setCancellationReason}
                  placeholder="Enter reason..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  numberOfLines={4}
                  className="text-text-primary text-base"
                  style={{textAlignVertical: 'top', minHeight: 80}}
                />
              </View>

              <View className="flex-row" style={{gap: 12}}>
                <View style={{flex: 1}}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setShowCancelModal(false);
                      setCancellationReason('');
                      setSelectedBooking(null);
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Button
                    title="Confirm"
                    onPress={confirmCancelBooking}
                    loading={cancelling}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default BookingsScreen;
