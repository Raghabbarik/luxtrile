import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
import { salonService } from '../../services/salonService';
import { bookingService } from '../../services/bookingService';
import { analyticsService } from '../../services/analyticsService';
import { formatDate } from '../../utils/dateHelper';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Loading from '../../components/Loading';

const OwnerDashboardScreen = ({ navigation }) => {
  const [salon, setSalon] = useState(null);
  const [stats, setStats] = useState({
    todayBookings: 0,
    monthlyBookings: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false for demonstration if needed, but should be true normally
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load salon info
      const salonResponse = await salonService.getMySalon();
      setSalon(salonResponse.data.salon);

      // Load booking stats
      const statsResponse = await analyticsService.getSalonBookingStats();
      const bookingStats = statsResponse.data;

      // Load earnings
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const earningsResponse = await analyticsService.getSalonEarnings(
        currentMonth.toISOString(),
        new Date().toISOString()
      );
      const earnings = earningsResponse.data.summary;

      // Load today's appointments
      const today = new Date().toISOString().split('T')[0];
      const bookingsResponse = await bookingService.getSalonBookings(null, today);
      const todayBookings = bookingsResponse.data.bookings || [];
      setTodayAppointments(todayBookings);

      // Calculate growth percentage
      const growthPercentage = bookingStats.monthly > 0 
        ? ((bookingStats.monthly / bookingStats.total) * 100).toFixed(1)
        : 0;

      setStats({
        todayBookings: bookingStats.today || 0,
        monthlyBookings: bookingStats.monthly || 0,
        totalEarnings: earnings.totalEarnings || 0,
        monthlyEarnings: earnings.totalRevenue || 0,
        totalBookings: bookingStats.total || 0,
        completedBookings: bookingStats.completed || 0,
        pendingBookings: bookingStats.pending || 0,
        growthPercentage: growthPercentage,
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      if (error.response?.status === 404) {
        navigation.navigate('SalonSetup');
      } else {
        // Silently fail - don't show alert on every load
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header
        title="Revenue & Growth"
        subtitle={salon?.name || 'MANAGEMENT'}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold.primary}
          />
        }>
        <View className="px-6 py-6">
          {/* Main Stats Card */}
          <LinearGradient
            colors={colors.gold.metallic}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[32px] p-8 mb-8"
            style={{
              shadowColor: colors.gold.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}>
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white/80 text-xs font-bold uppercase tracking-[2px]">
                  Total Revenue
                </Text>
                <Text className="text-white text-4xl font-bold mt-1 tracking-tight">
                  ₹{stats.totalEarnings.toLocaleString()}
                </Text>
              </View>
              <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
                <Icon name="pulse" size={32} color={colors.white} />
              </View>
            </View>
            <View className="h-[1px] bg-white/20 mb-6" />
            <View className="flex-row justify-between">
              <View>
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-[1px]">
                  This Month
                </Text>
                <Text className="text-white text-xl font-bold mt-1">
                  {stats.monthlyBookings}
                </Text>
              </View>
              <View>
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-[1px]">
                  Pending
                </Text>
                <Text className="text-white text-xl font-bold mt-1">
                  {stats.pendingBookings || 0}
                </Text>
              </View>
              <View>
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-[1px]">
                  Growth
                </Text>
                <Text className="text-white text-xl font-bold mt-1">
                  {stats.growthPercentage || 0}%
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => navigation.navigate('OwnerServices')}
                className="flex-1 mx-1"
                activeOpacity={0.7}>
                <Card variant="glass" className="p-6 items-center">
                  <View className="w-14 h-14 rounded-2xl bg-purple-500/10 items-center justify-center mb-3">
                    <Icon name="cut" size={28} color="#A855F7" />
                  </View>
                  <Text className="text-white text-sm font-bold">Services</Text>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('StaffManagement')}
                className="flex-1 mx-1"
                activeOpacity={0.7}>
                <Card variant="glass" className="p-6 items-center">
                  <View className="w-14 h-14 rounded-2xl bg-cyan-500/10 items-center justify-center mb-3">
                    <Icon name="people" size={28} color="#06B6D4" />
                  </View>
                  <Text className="text-white text-sm font-bold">Staff</Text>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('OwnerAnalytics')}
                className="flex-1 mx-1"
                activeOpacity={0.7}>
                <Card variant="glass" className="p-6 items-center">
                  <View className="w-14 h-14 rounded-2xl bg-orange-500/10 items-center justify-center mb-3">
                    <Icon name="stats-chart" size={28} color="#F97316" />
                  </View>
                  <Text className="text-white text-sm font-bold">Analytics</Text>
                </Card>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-xl font-bold">Quick Insights</Text>
            <TouchableOpacity>
              <Text className="text-gold-500 text-sm font-bold">Export PDF</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap -mx-2 mb-8">
            <View className="w-1/2 px-2 mb-4">
              <Card variant="glass" className="p-6">
                <View className="w-10 h-10 rounded-xl bg-gold-soft items-center justify-center mb-4">
                  <Icon name="calendar" size={20} color={colors.gold.primary} />
                </View>
                <Text className="text-text-tertiary text-[10px] font-bold uppercase tracking-[1.5px]">
                  TODAY
                </Text>
                <Text className="text-white text-2xl font-bold mt-1">
                  {stats.todayBookings}
                </Text>
              </Card>
            </View>

            <View className="w-1/2 px-2 mb-4">
              <Card variant="glass" className="p-6">
                <View className="w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mb-4">
                  <Icon name="trending-up" size={20} color={colors.status.info} />
                </View>
                <Text className="text-text-tertiary text-[10px] font-bold uppercase tracking-[1.5px]">
                  MONTH
                </Text>
                <Text className="text-white text-2xl font-bold mt-1">
                  ₹{stats.monthlyEarnings.toLocaleString()}
                </Text>
              </Card>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-xl font-bold">Live Feed</Text>
            <TouchableOpacity onPress={() => navigation.navigate('OwnerBookings')}>
              <Text className="text-gold-500 text-sm font-bold">View History</Text>
            </TouchableOpacity>
          </View>

          {todayAppointments.length === 0 ? (
            <Card variant="glass" className="p-10 items-center border-dashed border-[1.5px] border-dark-light/30">
              <Icon
                name="sparkles-outline"
                size={48}
                color={colors.dark.light}
              />
              <Text className="text-white text-base font-bold mt-4">
                No Appointments Today
              </Text>
              <Text className="text-text-tertiary text-sm mt-1 text-center">
                Your dashboard will update as soon as appointments are booked.
              </Text>
              <TouchableOpacity className="mt-6 bg-gold-soft px-6 py-3 rounded-2xl border-[1px] border-gold-500/30">
                <Text className="text-gold-500 font-bold text-xs uppercase tracking-widest">
                  Share Salon Link
                </Text>
              </TouchableOpacity>
            </Card>
          ) : (
            todayAppointments.map(booking => {
              const statusColors = {
                pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
                confirmed: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
                completed: { bg: 'bg-status-success/10', text: 'text-status-success' },
                cancelled: { bg: 'bg-status-error/10', text: 'text-status-error' },
              };
              const statusColor = statusColors[booking.status] || statusColors.pending;

              return (
                <Card key={booking._id} variant="glass" className="mb-4 p-5">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row items-start flex-1">
                      <View className="w-12 h-12 rounded-2xl bg-gold-soft items-center justify-center">
                        <Text className="text-gold-500 font-bold text-lg">
                          {booking.client?.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                      </View>
                      <View className="ml-4 flex-1">
                        <Text className="text-white text-base font-bold" numberOfLines={1}>
                          {booking.client?.name || 'Unknown Client'}
                        </Text>
                        <View className="flex-row items-center mt-1">
                          <Icon name="time" size={12} color={colors.gold.primary} />
                          <Text className="text-text-tertiary text-xs ml-1">
                            {booking.startTime}
                          </Text>
                        </View>
                        {booking.services && booking.services.length > 0 && (
                          <View className="flex-row items-center mt-1">
                            <Icon name="cut" size={12} color={colors.text.tertiary} />
                            <Text className="text-text-tertiary text-xs ml-1" numberOfLines={1}>
                              {booking.services.map(s => s.name).join(', ')}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View className="items-end ml-2">
                      <Text className="text-white font-bold text-base">
                        ₹{booking.totalAmount || 0}
                      </Text>
                      <View className={`${statusColor.bg} px-2 py-1 rounded-lg mt-1`}>
                        <Text className={`${statusColor.text} text-[10px] font-bold uppercase tracking-widest`}>
                          {booking.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OwnerDashboardScreen;
