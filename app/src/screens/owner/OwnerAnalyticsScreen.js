import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, RefreshControl, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {colors} from '../../theme/colors';
import {analyticsService} from '../../services/analyticsService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Loading from '../../components/Loading';

const screenWidth = Dimensions.get('window').width;

const OwnerAnalyticsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    newClients: 0,
    avgRevenue: 0,
    revenueGrowth: 0,
    bookingGrowth: 0,
    clientGrowth: 0,
    avgGrowth: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Get last 7 days data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const earningsResponse = await analyticsService.getSalonEarnings(
        startDate.toISOString(),
        endDate.toISOString(),
      );

      const bookingStatsResponse = await analyticsService.getSalonBookingStats();

      const earnings = earningsResponse.data;
      const bookingStats = bookingStatsResponse.data;

      // Calculate stats
      const totalRevenue = earnings.summary.totalRevenue || 0;
      const totalBookings = bookingStats.total || 0;
      const avgRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      // Mock growth percentages (you can calculate from previous period)
      setStats({
        totalRevenue,
        totalBookings,
        newClients: bookingStats.monthly || 0,
        avgRevenue: Math.round(avgRevenue),
        revenueGrowth: 15,
        bookingGrowth: 8,
        clientGrowth: 12,
        avgGrowth: 5,
      });

      // Prepare chart data
      const dailyRevenue = earnings.daily || [];
      const last7Days = dailyRevenue.slice(-7);
      
      const labels = last7Days.length > 0 
        ? last7Days.map(d => {
            const date = new Date(d.date);
            return date.getDate().toString();
          })
        : ['1', '2', '3', '4', '5', '6', '7'];
        
      const revenues = last7Days.length > 0 
        ? last7Days.map(d => d.revenue)
        : [0, 0, 0, 0, 0, 0, 0];

      setRevenueData({
        labels,
        datasets: [{data: revenues}],
      });

      // Prepare booking data from daily data
      const last7DaysBookings = last7Days.length > 0 
        ? last7Days.map(d => d.bookings || 0)
        : [0, 0, 0, 0, 0, 0, 0];

      const bookingLabels = last7Days.length > 0
        ? last7Days.map(d => {
            const date = new Date(d.date);
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return days[date.getDay()];
          })
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      setBookingData({
        labels: bookingLabels,
        datasets: [{data: last7DaysBookings}],
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Set default empty data to prevent crashes
      setStats({
        totalRevenue: 0,
        totalBookings: 0,
        newClients: 0,
        avgRevenue: 0,
        revenueGrowth: 0,
        bookingGrowth: 0,
        clientGrowth: 0,
        avgGrowth: 0,
      });
      setRevenueData({
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{data: [0, 0, 0, 0, 0, 0, 0]}],
      });
      setBookingData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{data: [0, 0, 0, 0, 0, 0, 0]}],
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading />;
  }

  const chartConfig = {
    backgroundColor: colors.dark.tertiary,
    backgroundGradientFrom: colors.dark.tertiary,
    backgroundGradientTo: colors.dark.secondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.6})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.gold.primary,
    },
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <LinearGradient
        colors={['#8B5CF6', '#06B6D4']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        className="pt-16 pb-6 px-6">
        <View className="flex-row items-center mb-2">
          <Icon
            name="arrow-back"
            size={24}
            color={colors.white}
            onPress={() => navigation.goBack()}
          />
          <Text className="text-white text-2xl font-bold ml-4">
            Analytics & Earnings
          </Text>
        </View>
        <Text className="text-white/80 text-sm ml-10">
          Last 7 days performance
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 16, paddingBottom: 100}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold.primary}
          />
        }>
        {/* Stats Grid */}
        <View className="flex-row flex-wrap -mx-2 mb-6">
          <View className="w-1/2 px-2 mb-4">
            <Card variant="glass" className="p-5">
              <View className="w-12 h-12 rounded-xl bg-purple-500/10 items-center justify-center mb-3">
                <Icon name="cash" size={24} color="#A855F7" />
              </View>
              <Text className="text-text-tertiary text-xs font-bold uppercase tracking-wider">
                Total Revenue
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                ₹{stats.totalRevenue.toLocaleString()}
              </Text>
              <View className="flex-row items-center mt-2">
                <Icon name="trending-up" size={12} color="#10B981" />
                <Text className="text-green-500 text-xs font-bold ml-1">
                  +{stats.revenueGrowth}%
                </Text>
              </View>
            </Card>
          </View>

          <View className="w-1/2 px-2 mb-4">
            <Card variant="glass" className="p-5">
              <View className="w-12 h-12 rounded-xl bg-cyan-500/10 items-center justify-center mb-3">
                <Icon name="calendar" size={24} color="#06B6D4" />
              </View>
              <Text className="text-text-tertiary text-xs font-bold uppercase tracking-wider">
                Total Bookings
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {stats.totalBookings}
              </Text>
              <View className="flex-row items-center mt-2">
                <Icon name="trending-up" size={12} color="#10B981" />
                <Text className="text-green-500 text-xs font-bold ml-1">
                  +{stats.bookingGrowth}%
                </Text>
              </View>
            </Card>
          </View>

          <View className="w-1/2 px-2 mb-4">
            <Card variant="glass" className="p-5">
              <View className="w-12 h-12 rounded-xl bg-orange-500/10 items-center justify-center mb-3">
                <Icon name="people" size={24} color="#F97316" />
              </View>
              <Text className="text-text-tertiary text-xs font-bold uppercase tracking-wider">
                New Clients
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {stats.newClients}
              </Text>
              <View className="flex-row items-center mt-2">
                <Icon name="trending-up" size={12} color="#10B981" />
                <Text className="text-green-500 text-xs font-bold ml-1">
                  +{stats.clientGrowth}%
                </Text>
              </View>
            </Card>
          </View>

          <View className="w-1/2 px-2 mb-4">
            <Card variant="glass" className="p-5">
              <View className="w-12 h-12 rounded-xl bg-pink-500/10 items-center justify-center mb-3">
                <Icon name="trending-up" size={24} color="#EC4899" />
              </View>
              <Text className="text-text-tertiary text-xs font-bold uppercase tracking-wider">
                Avg. Revenue
              </Text>
              <Text className="text-white text-2xl font-bold mt-1">
                ₹{stats.avgRevenue}
              </Text>
              <View className="flex-row items-center mt-2">
                <Icon name="trending-up" size={12} color="#10B981" />
                <Text className="text-green-500 text-xs font-bold ml-1">
                  +{stats.avgGrowth}%
                </Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Revenue Chart */}
        <Card variant="glass" className="p-4 mb-6">
          <Text className="text-white text-lg font-bold mb-4">Daily Revenue</Text>
          <LineChart
            data={revenueData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        </Card>

        {/* Bookings Chart */}
        <Card variant="glass" className="p-4 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Weekly Bookings
          </Text>
          <BarChart
            data={bookingData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            style={{
              borderRadius: 16,
            }}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

export default OwnerAnalyticsScreen;
