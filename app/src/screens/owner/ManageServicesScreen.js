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
import {serviceService} from '../../services/serviceService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const ManageServicesScreen = ({navigation}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadServices();
  }, [filter]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getMyServices();
      let filteredServices = response.data.services;

      if (filter !== 'all') {
        filteredServices = filteredServices.filter(s => s.gender === filter);
      }

      setServices(filteredServices);
    } catch (error) {
      Alert.alert('Error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const handleDeleteService = serviceId => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await serviceService.deleteService(serviceId);
              Alert.alert('Success', 'Service deleted successfully');
              loadServices();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service');
            }
          },
        },
      ],
    );
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      await serviceService.updateService(serviceId, {
        isActive: !currentStatus,
      });
      loadServices();
    } catch (error) {
      Alert.alert('Error', 'Failed to update service status');
    }
  };

  const renderServiceCard = ({item}) => (
    <Card variant="glass" style={{marginBottom: 16}}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-text-primary text-lg font-bold">
            {item.name}
          </Text>
          {item.description && (
            <Text className="text-text-tertiary text-xs mt-1">
              {item.description}
            </Text>
          )}
          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center mr-4">
              <Icon name="time-outline" size={14} color={colors.text.tertiary} />
              <Text className="text-text-secondary text-xs ml-1">
                {item.duration} mins
              </Text>
            </View>
            <View className="flex-row items-center">
              <Icon
                name={
                  item.gender === 'male'
                    ? 'male'
                    : 'people'
                }
                size={14}
                color={colors.text.tertiary}
              />
              <Text className="text-text-secondary text-xs ml-1 capitalize">
                {item.gender}
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-gold-500 text-xl font-bold ml-4">
          ₹{item.price}
        </Text>
      </View>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={() => toggleServiceStatus(item._id, item.isActive)}
          className={`flex-1 py-2 rounded-xl items-center ${
            item.isActive ? 'bg-status-success' : 'bg-dark-tertiary'
          }`}
          style={{opacity: 0.2}}>
          <Text
            className={`text-sm font-semibold ${
              item.isActive ? 'text-status-success' : 'text-text-tertiary'
            }`}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('EditService', {service: item})}
          className="px-4 py-2 bg-gold-500 rounded-xl">
          <Icon name="create-outline" size={20} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteService(item._id)}
          className="px-4 py-2 bg-status-error rounded-xl"
          style={{opacity: 0.2}}>
          <Icon name="trash-outline" size={20} color={colors.status.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header
        title="Manage Services"
        subtitle="Add and edit your services"
        rightIcon="add-circle-outline"
        onRightPress={() => navigation.navigate('AddService')}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3"
        style={{maxHeight: 60}}>
        {['all', 'male', 'unisex'].map(f => (
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
        data={services}
        renderItem={renderServiceCard}
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
            icon="cut-outline"
            title="No Services Found"
            message="Start by adding your first service"
            actionText="Add Service"
            onAction={() => navigation.navigate('AddService')}
          />
        }
      />
    </View>
  );
};

export default ManageServicesScreen;
