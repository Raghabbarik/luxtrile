import {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import {colors} from '../../theme/colors';
import {salonService} from '../../services/salonService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const ClientHomeScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('Current Location');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const services = [
    {id: 'haircut', name: 'Haircut', icon: '✂️'},
    {id: 'beard', name: 'Beard', icon: '🧔'},
    {id: 'other', name: 'Other', icon: '✨'},
  ];

  useEffect(() => {
    // First get location, then load salons
    requestLocationPermission();
  }, []);

  useEffect(() => {
    // Load salons after location is detected (or failed)
    if (locationName !== 'Current Location') {
      console.log('Location ready, loading salons for:', locationName);
      loadSalons(selectedCategory);
    }
  }, [locationName, selectedCategory]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        console.log('Requesting location permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Luxtril needs access to your location to show nearby salons',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Permission result:', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Location permission granted');
          getCurrentLocation();
        } else {
          console.log('❌ Location permission denied');
          setLocationName('Permission Denied');
        }
      } catch (err) {
        console.warn('Permission error:', err);
        setLocationName('Location Unavailable');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    console.log('Attempting to get location...');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('✅ Got location:', latitude, longitude);
        setLocation({latitude, longitude});
        getLocationName(latitude, longitude);
      },
      error => {
        console.log('❌ Location error:', error.code, error.message);
        setLocationName('Location Unavailable');
        
        // Try to get last known location as fallback
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            console.log('✅ Got cached location:', latitude, longitude);
            setLocation({latitude, longitude});
            getLocationName(latitude, longitude);
          },
          fallbackError => {
            console.log('❌ Fallback also failed:', fallbackError.message);
          },
          {enableHighAccuracy: false, timeout: 5000, maximumAge: 60000},
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 5000},
    );
  };

  const getLocationName = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Luxtril-App',
          },
        },
      );
      const data = await response.json();

      if (data && data.address) {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county;
        const state =
          data.address.state || data.address.state_district;

        if (city && state) {
          setLocationName(`${city}, ${state}`);
        } else if (city) {
          setLocationName(city);
        } else {
          setLocationName(data.display_name.split(',')[0]);
        }
      } else {
        setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
      }
    } catch (error) {
      console.log('Geocoding error:', error);
      setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
    }
  };

  const loadSalons = async (category = null) => {
    try {
      setLoading(true);
      const params = {
        isApproved: true,
        page: 1,
        limit: 20,
      };

      // If location detected, filter by city name
      if (locationName && locationName !== 'Current Location' && locationName !== 'Location Unavailable' && locationName !== 'Permission Denied') {
        // Extract city from locationName (format: "City, State")
        const city = locationName.split(',')[0].trim();
        if (city) {
          params.city = city;
          console.log('Filtering salons by city:', city);
        }
      }

      // If category selected, filter by service category
      if (category) {
        params.serviceCategory = category;
        console.log('Filtering salons by category:', category);
      }

      const response = await salonService.getAllSalons(params);
      console.log('Loaded salons:', response.data.salons.length);
      setSalons(response.data.salons);
    } catch (error) {
      console.error('Failed to load salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      setLoading(true);
      const response = await salonService.searchSalons(searchQuery);
      setSalons(response.data.salons);
    } catch (error) {
      Alert.alert('Error', 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSalons(selectedCategory);
    setRefreshing(false);
  };

  const handleCategorySelect = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(categoryId);
    }
  };

  if (loading && !refreshing) {
    return <Loading message="Finding salons near you..." />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <View
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: colors.gold.soft,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold.primary}
          />
        }>
        <View className="px-6 pt-16 pb-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <TouchableOpacity className="flex-row items-center">
                <Icon name="location" size={16} color={colors.gold.primary} />
                <Text
                  className="text-white text-sm font-bold ml-1"
                  numberOfLines={1}>
                  {locationName}
                </Text>
                <Icon
                  name="chevron-down"
                  size={14}
                  color={colors.text.tertiary}
                  className="ml-1"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="w-12 h-12 rounded-full border-[1px] border-dark-light/20 items-center justify-center bg-dark-tertiary/50">
              <Icon name="notifications-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View className="mt-6 mb-4">
            <Text className="text-white text-4xl font-bold tracking-tighter">
              Luxtril<Text className="text-gold-500">.</Text>
            </Text>
            <Text className="text-text-secondary text-base font-medium mt-1">
              Luxury grooming at your fingertips
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-tertiary rounded-2xl px-4 py-4 mt-4 border-[1px] border-dark-light/10 shadow-sm">
            <Icon name="search" size={20} color={colors.gold.primary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for salon, stylist, spa..."
              placeholderTextColor={colors.text.tertiary}
              className="flex-1 text-text-primary text-base ml-3 font-medium"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity className="bg-gold-500 p-2 rounded-xl">
              <Icon name="options-outline" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Service Categories */}
          <View className="mt-6">
            <Text className="text-white text-lg font-bold mb-3">
              Services
            </Text>
            <View className="flex-row justify-between">
              {services.map(service => (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => handleCategorySelect(service.id)}
                  className={`flex-1 mx-1 rounded-2xl py-4 px-3 border-[1px] ${
                    selectedCategory === service.id
                      ? 'bg-gold-500 border-gold-500'
                      : 'bg-dark-tertiary border-dark-light/10'
                  }`}
                  style={{
                    shadowColor: selectedCategory === service.id ? colors.gold.primary : '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: selectedCategory === service.id ? 0.4 : 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}>
                  <Text className="text-center text-2xl mb-1">
                    {service.icon}
                  </Text>
                  <Text
                    className={`text-center text-sm font-bold ${
                      selectedCategory === service.id
                        ? 'text-white'
                        : 'text-text-secondary'
                    }`}>
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View className="px-4 mt-6">
          {salons.map(item => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('SalonDetails', {salonId: item._id})
              }
              className="mb-4">
              <View
                className="rounded-3xl overflow-hidden bg-dark-tertiary border-[1px] border-dark-light/10"
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 4},
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}>
                <FastImage
                  source={{
                    uri:
                      item.images?.[0] ||
                      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
                    priority: FastImage.priority.normal,
                  }}
                  className="w-full h-48"
                  resizeMode={FastImage.resizeMode.cover}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  className="absolute top-0 left-0 right-0 h-48"
                />

                <View className="p-4">
                  <Text
                    className="text-white text-xl font-bold mb-2"
                    numberOfLines={1}>
                    {item.name}
                  </Text>

                  <View className="flex-row items-center mb-3">
                    <Icon name="location" size={14} color={colors.text.tertiary} />
                    <Text
                      className="text-text-tertiary text-sm ml-2 flex-1"
                      numberOfLines={1}>
                      {item.address.city}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center bg-gold-soft px-3 py-2 rounded-xl">
                      <Icon name="star" size={14} color={colors.gold.primary} />
                      <Text className="text-gold-500 text-sm font-bold ml-1">
                        {item.rating.average.toFixed(1)}
                      </Text>
                    </View>
                    <View className="bg-gold-500 px-6 py-2 rounded-xl">
                      <Text className="text-white text-sm font-bold">
                        BOOK NOW
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {salons.length === 0 && (
            <EmptyState
              icon="business-outline"
              title="No Salons Found"
              message="We couldn't find any salons in your area."
              actionText="Refresh"
              onAction={onRefresh}
            />
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default ClientHomeScreen;
