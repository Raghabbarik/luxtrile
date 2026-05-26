import {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {useAuth} from '../../context/AuthContext';
import {userService} from '../../services/userService';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ProfileScreen = ({navigation}) => {
  const {user, logout, updateUser} = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', 'Failed to pick image');
      return;
    }

    const asset = result.assets[0];
    if (!asset) return;

    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('profileImage', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'profile.jpg',
      });

      const response = await userService.updateProfile(formData);
      
      console.log('Profile update response:', response);
      console.log('Updated user:', response.data.user);
      console.log('Profile image URL:', response.data.user.profileImage);
      
      if (response.success) {
        updateUser(response.data.user);
        setImageKey(Date.now()); // Force image refresh
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);

      const response = await userService.updateProfile(formData);
      
      if (response.success) {
        updateUser(response.data.user);
        setShowEditModal(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await userService.updatePassword(currentPassword, newPassword);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Profile" subtitle="Manage your account" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
        <View className="items-center py-8">
          <TouchableOpacity onPress={handleImagePick} disabled={uploadingImage}>
            <View className="relative">
              <View className="w-28 h-28 rounded-full border-4 border-gold-500 p-1 bg-dark-tertiary">
                <FastImage
                  key={imageKey}
                  source={{
                    uri: user?.profileImage
                      ? `${user.profileImage}?t=${imageKey}`
                      : 'https://via.placeholder.com/150',
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.web,
                  }}
                  className="w-full h-full rounded-full"
                  resizeMode={FastImage.resizeMode.cover}
                />
                {uploadingImage && (
                  <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
                    <Text className="text-white text-xs">Uploading...</Text>
                  </View>
                )}
              </View>
              <View className="absolute bottom-0 right-0 bg-gold-500 w-10 h-10 rounded-full items-center justify-center border-4 border-dark-primary">
                <Icon name="camera" size={18} color={colors.white} />
              </View>
            </View>
          </TouchableOpacity>

          <Text className="text-text-primary text-2xl font-bold mt-4">
            {user?.name}
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            {user?.email}
          </Text>
        </View>

        <View className="px-4">
          <Card variant="glass" style={{marginBottom: 16}}>
            <TouchableOpacity
              onPress={() => setShowEditModal(true)}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <Icon name="person-outline" size={24} color={colors.gold.primary} />
                <View className="ml-3 flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    Edit Profile
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    Update your personal information
                  </Text>
                </View>
              </View>
              <Icon
                name="chevron-forward"
                size={20}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>
          </Card>

          <Card variant="glass" style={{marginBottom: 16}}>
            <TouchableOpacity
              onPress={() => setShowPasswordModal(true)}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <Icon
                  name="lock-closed-outline"
                  size={24}
                  color={colors.gold.primary}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    Change Password
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    Update your account password
                  </Text>
                </View>
              </View>
              <Icon
                name="chevron-forward"
                size={20}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>
          </Card>

          <Card variant="glass" style={{marginBottom: 16}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('HelpSupport')}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <Icon
                  name="help-circle-outline"
                  size={24}
                  color={colors.gold.primary}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    Help & Support
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    FAQs and support information
                  </Text>
                </View>
              </View>
              <Icon
                name="chevron-forward"
                size={20}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>
          </Card>

          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            icon={<Icon name="log-out-outline" size={20} color={colors.gold.primary} />}
            style={{marginTop: 8, marginBottom: 32}}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}>
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setShowEditModal(false)}
          className="flex-1 justify-end"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-dark-secondary rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-text-primary text-xl font-bold">
                  Edit Profile
                </Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Icon name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                icon="person-outline"
                style={{marginBottom: 16}}
              />

              <Input
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
                icon="call-outline"
                style={{marginBottom: 24}}
              />

              <View className="flex-row" style={{gap: 12}}>
                <View style={{flex: 1}}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => setShowEditModal(false)}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Button
                    title="Save"
                    onPress={handleUpdateProfile}
                    loading={loading}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}>
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setShowPasswordModal(false)}
          className="flex-1 justify-end"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-dark-secondary rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-text-primary text-xl font-bold">
                  Change Password
                </Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Icon name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <Input
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
                icon="lock-closed-outline"
                style={{marginBottom: 16}}
              />

              <Input
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
                icon="lock-closed-outline"
                style={{marginBottom: 16}}
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                icon="lock-closed-outline"
                style={{marginBottom: 24}}
              />

              <View className="flex-row" style={{gap: 12}}>
                <View style={{flex: 1}}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => setShowPasswordModal(false)}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Button
                    title="Change"
                    onPress={handleChangePassword}
                    loading={loading}
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

export default ProfileScreen;
