import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Rating} from 'react-native-ratings';
import {colors} from '../../theme/colors';
import {bookingService} from '../../services/bookingService';
import {reviewService} from '../../services/reviewService';
import {formatDate, formatTime} from '../../utils/dateHelper';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import Input from '../../components/Input';

const BookingDetailsScreen = ({route, navigation}) => {
  const {bookingId} = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBookingDetails();
  }, []);

  const loadBookingDetails = async () => {
    try {
      const response = await bookingService.getBookingById(bookingId);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Failed to load booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.createReview({
        bookingId: booking._id,
        rating,
        comment,
      });
      setShowReviewModal(false);
      setComment('');
      setRating(5);
      Alert.alert('Success', 'Review submitted successfully');
      await loadBookingDetails();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const canReview = booking.status === 'completed';

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Booking Details" showBack />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-4 py-6">
          <Card variant="glass" style={{marginBottom: 16}}>
            <View className="flex-row justify-between items-start mb-4">
              <Text className="text-text-primary text-xl font-bold flex-1">
                {booking.salon.name}
              </Text>
              <StatusBadge status={booking.status} />
            </View>

            <View className="flex-row items-center mb-2">
              <Icon name="location-outline" size={18} color={colors.gold.primary} />
              <Text className="text-text-secondary text-sm ml-2 flex-1">
                {booking.salon.address.street}, {booking.salon.address.city}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Icon name="call-outline" size={18} color={colors.gold.primary} />
              <Text className="text-text-secondary text-sm ml-2">
                {booking.salon.phone}
              </Text>
            </View>
          </Card>

          <Card variant="glass" style={{marginBottom: 16}}>
            <Text className="text-text-primary text-lg font-bold mb-4">
              Appointment Details
            </Text>

            <View className="flex-row items-center mb-3">
              <Icon name="calendar-outline" size={18} color={colors.gold.primary} />
              <Text className="text-text-secondary text-sm ml-2">
                {formatDate(new Date(booking.bookingDate))}
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Icon name="time-outline" size={18} color={colors.gold.primary} />
              <Text className="text-text-secondary text-sm ml-2">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </Text>
            </View>

            {booking.staff && (
              <View className="flex-row items-center mb-3">
                <Icon name="person-outline" size={18} color={colors.gold.primary} />
                <Text className="text-text-secondary text-sm ml-2">
                  {booking.staff.name} • {booking.staff.role}
                </Text>
              </View>
            )}

            <View className="flex-row items-center">
              <Icon name="hourglass-outline" size={18} color={colors.gold.primary} />
              <Text className="text-text-secondary text-sm ml-2">
                {booking.totalDuration} minutes
              </Text>
            </View>
          </Card>

          <Card variant="glass" style={{marginBottom: 16}}>
            <Text className="text-text-primary text-lg font-bold mb-4">
              Services
            </Text>

            {booking.services.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center mb-3">
                <View className="flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    {item.service.name}
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    {item.duration} mins
                  </Text>
                </View>
                <Text className="text-gold-500 text-base font-bold">
                  ₹{item.price}
                </Text>
              </View>
            ))}

            <View className="h-px bg-dark-tertiary my-3" />

            <View className="flex-row justify-between items-center">
              <Text className="text-text-primary text-base font-bold">
                Total Amount
              </Text>
              <Text className="text-gold-500 text-xl font-bold">
                ₹{booking.totalAmount}
              </Text>
            </View>
          </Card>

          {booking.payment && (
            <Card variant="glass" style={{marginBottom: 16}}>
              <Text className="text-text-primary text-lg font-bold mb-4">
                Payment Details
              </Text>

              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary text-sm">Payment ID</Text>
                <Text className="text-text-primary text-sm font-semibold">
                  {booking.payment.razorpayPaymentId?.slice(-10)}
                </Text>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-text-secondary text-sm">Status</Text>
                <StatusBadge status={booking.paymentStatus} />
              </View>

              <View className="flex-row justify-between">
                <Text className="text-text-secondary text-sm">Amount Paid</Text>
                <Text className="text-gold-500 text-base font-bold">
                  ₹{booking.totalAmount}
                </Text>
              </View>
            </Card>
          )}

          {canReview && (
            <Button
              title="Write a Review"
              onPress={() => setShowReviewModal(true)}
              icon={<Icon name="star-outline" size={20} color={colors.white} />}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowReviewModal(false);
          setComment('');
          setRating(5);
        }}>
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => {
            setShowReviewModal(false);
            setComment('');
            setRating(5);
          }}
          className="flex-1 justify-end"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-dark-secondary rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-text-primary text-xl font-bold">
                  Rate Your Experience
                </Text>
                <TouchableOpacity onPress={() => {
                  setShowReviewModal(false);
                  setComment('');
                  setRating(5);
                }}>
                  <Icon name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <View className="items-center mb-6">
                <Rating
                  type="custom"
                  ratingCount={5}
                  imageSize={40}
                  startingValue={rating}
                  onFinishRating={setRating}
                  tintColor={colors.dark.secondary}
                  ratingBackgroundColor={colors.dark.tertiary}
                  ratingColor={colors.gold.primary}
                />
              </View>

              <Input
                label="Your Review"
                value={comment}
                onChangeText={setComment}
                placeholder="Share your experience..."
                multiline
                numberOfLines={4}
                style={{marginBottom: 24}}
              />

              <View className="flex-row" style={{gap: 12}}>
                <View style={{flex: 1}}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setShowReviewModal(false);
                      setComment('');
                      setRating(5);
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Button
                    title="Submit"
                    onPress={handleSubmitReview}
                    loading={submitting}
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

export default BookingDetailsScreen;
