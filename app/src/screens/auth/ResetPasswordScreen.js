import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {colors} from '../../theme/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';

const ResetPasswordScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert(
          'Error',
          'You must be logged in to change your password. Please use Forgot Password to get a reset link.',
        );
        return;
      }
      await currentUser.updatePassword(password);
      Alert.alert('Success', 'Password changed successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      let message = 'Failed to reset password';
      if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Use at least 6 characters.';
      } else if (error.code === 'auth/requires-recent-login') {
        message =
          'Please log out and log back in before changing your password.';
      } else if (error.message) {
        message = error.message;
      }
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Change Password" showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-8 py-8">
            <View className="items-center mb-8">
              <View className="w-24 h-24 rounded-full bg-gold-500/20 items-center justify-center mb-4">
                <Icon name="key" size={48} color={colors.gold.primary} />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                New Password
              </Text>
              <Text className="text-text-secondary text-center">
                Enter and confirm your new password below
              </Text>
            </View>

            <View
              className="p-6 rounded-[32px] border-[1px] border-dark-light/10"
              style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
              <Input
                label="New Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                icon="lock-closed-outline"
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
                icon="lock-closed-outline"
                style={{marginTop: 16}}
              />

              <Button
                title="Change Password"
                onPress={handleSubmit}
                loading={loading}
                style={{marginTop: 24}}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPasswordScreen;
