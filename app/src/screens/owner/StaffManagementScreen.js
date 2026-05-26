import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {staffService} from '../../services/staffService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const StaffManagementScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getMyStaff();
      setStaff(response.data.staff);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.[0]) {
      setProfileImage(result.assets[0]);
    }
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setRole('');
    setPhone('');
    setEmail('');
    setProfileImage(null);
    setIsAvailable(true);
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setName(member.name);
    setRole(member.role);
    setPhone(member.phone);
    setEmail(member.email || '');
    setProfileImage(null);
    setIsAvailable(member.isAvailable);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!name || !role || !phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', role);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('isAvailable', isAvailable);

      if (profileImage) {
        formData.append('profileImage', {
          uri: profileImage.uri,
          type: profileImage.type || 'image/jpeg',
          name: profileImage.fileName || 'profile.jpg',
        });
      }

      if (editingStaff) {
        await staffService.updateStaff(editingStaff._id, formData);
        Alert.alert('Success', 'Staff member updated successfully');
      } else {
        await staffService.createStaff(formData);
        Alert.alert('Success', 'Staff member added successfully');
      }

      setShowModal(false);
      loadStaff();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save staff member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (member) => {
    Alert.alert(
      'Delete Staff Member',
      `Are you sure you want to remove ${member.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await staffService.deleteStaff(member._id);
              Alert.alert('Success', 'Staff member deleted');
              loadStaff();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete staff member');
            }
          },
        },
      ],
    );
  };

  const toggleAvailability = async (member) => {
    try {
      const formData = new FormData();
      formData.append('isAvailable', !member.isAvailable);
      await staffService.updateStaff(member._id, formData);
      loadStaff();
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-dark-primary">
      <Header
        title="Staff Management"
        subtitle={`${staff.length} team members`}
        showBack
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 16, paddingBottom: 100}}>
        {staff.map((member) => (
          <Card key={member._id} variant="glass" style={{marginBottom: 16}}>
            <View className="flex-row items-start">
              <FastImage
                source={{
                  uri: member.profileImage || 'https://via.placeholder.com/100',
                  priority: FastImage.priority.normal,
                }}
                className="w-20 h-20 rounded-full"
                resizeMode={FastImage.resizeMode.cover}
              />

              <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-white text-lg font-bold flex-1">
                    {member.name}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      member.isAvailable ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        member.isAvailable ? 'text-green-500' : 'text-red-500'
                      }`}>
                      {member.isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                </View>

                <Text className="text-text-secondary text-sm mb-2">
                  {member.role}
                </Text>

                <View className="flex-row items-center mb-1">
                  <Icon name="star" size={14} color={colors.gold.primary} />
                  <Text className="text-text-secondary text-xs ml-1">
                    {member.rating.average.toFixed(1)} • {member.totalBookings} bookings
                  </Text>
                </View>

                <View className="flex-row items-center mb-1">
                  <Icon name="call-outline" size={14} color={colors.text.tertiary} />
                  <Text className="text-text-secondary text-xs ml-1">
                    {member.phone}
                  </Text>
                </View>

                <View className="flex-row items-center mt-3">
                  <View className="flex-row items-center mr-4">
                    <Text className="text-text-tertiary text-xs mr-2">Available</Text>
                    <Switch
                      value={member.isAvailable}
                      onValueChange={() => toggleAvailability(member)}
                      trackColor={{false: colors.dark.tertiary, true: colors.gold.primary}}
                      thumbColor={colors.white}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => openEditModal(member)}
                    className="bg-dark-light/20 px-3 py-2 rounded-lg mr-2">
                    <Icon name="create-outline" size={18} color={colors.gold.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(member)}
                    className="bg-status-error/20 px-3 py-2 rounded-lg">
                    <Icon name="trash-outline" size={18} color={colors.status.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        ))}

        {staff.length === 0 && (
          <EmptyState
            icon="people-outline"
            title="No Staff Members"
            message="Add your first team member to get started"
          />
        )}
      </ScrollView>

      <View className="absolute right-6" style={{bottom: 68 + insets.bottom + 20}}>
        <TouchableOpacity
          onPress={openAddModal}
          className="bg-gold-500 w-16 h-16 rounded-full items-center justify-center"
          style={{
            shadowColor: colors.gold.primary,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <Icon name="add" size={32} color={colors.white} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowModal(false)}
          className="flex-1 justify-end"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <ScrollView className="bg-dark-secondary rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-xl font-bold">
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icon name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleImagePick}
                className="items-center mb-6">
                <View className="w-24 h-24 rounded-full bg-dark-tertiary items-center justify-center overflow-hidden">
                  {profileImage || editingStaff?.profileImage ? (
                    <FastImage
                      source={{
                        uri: profileImage?.uri || editingStaff?.profileImage,
                        priority: FastImage.priority.normal,
                      }}
                      className="w-full h-full"
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ) : (
                    <Icon name="person" size={40} color={colors.text.tertiary} />
                  )}
                </View>
                <Text className="text-gold-500 text-sm mt-2">Change Photo</Text>
              </TouchableOpacity>

              <Input
                label="Name *"
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                icon="person-outline"
                style={{marginBottom: 16}}
              />

              <Input
                label="Role *"
                value={role}
                onChangeText={setRole}
                placeholder="e.g. Hair Stylist, Barber"
                icon="briefcase-outline"
                style={{marginBottom: 16}}
              />

              <Input
                label="Phone *"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                icon="call-outline"
                style={{marginBottom: 16}}
              />

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                icon="mail-outline"
                style={{marginBottom: 24}}
              />

              <View className="flex-row" style={{gap: 12}}>
                <View style={{flex: 1}}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => setShowModal(false)}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Button
                    title={editingStaff ? 'Update' : 'Add'}
                    onPress={handleSubmit}
                    loading={submitting}
                  />
                </View>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default StaffManagementScreen;
