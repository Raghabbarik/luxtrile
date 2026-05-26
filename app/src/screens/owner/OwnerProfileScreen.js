import {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
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

const OwnerProfileScreen = ({navigation}) => {
  const {user, logout, updateUser} = useAuth();
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

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
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
              onPress={() => navigation.navigate('SalonSetup')}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <Icon name="business-outline" size={24} color={colors.gold.primary} />
                <View className="ml-3 flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    Salon Settings
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    Manage your salon details
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
              onPress={() => navigation.navigate('SlotsManagement')}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <Icon name="time-outline" size={24} color={colors.gold.primary} />
                <View className="ml-3 flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    Slot Management
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    Configure booking slots & seats
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
              onPress={() => navigation.navigate('StaffManagement')}
              className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center flex-1">
                <Icon name="people-outline" size={24} color={colors.gold.primary} />
                <View className="ml-3 flex-1">
                  <Text className="text-text-primary text-base font-semibold">
                    Staff Management
                  </Text>
                  <Text className="text-text-tertiary text-xs mt-1">
                    Manage your team members
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
    </View>
  );
};

export default OwnerProfileScreen;
