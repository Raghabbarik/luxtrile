import {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {authService} from '../../services/authService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';

const ResetPasswordScreen = ({navigation}) => {
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resetToken || !password || !confirmPassword) {
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
      await authService.resetPassword(resetToken, password);
      Alert.alert('Success', 'Password reset successful', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to reset password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <Header title="Reset Password" showBack />

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
                Create New Password
              </Text>
              <Text className="text-text-secondary text-center">
                Enter the reset token from your email and create a new password
              </Text>
            </View>

            <View
              className="p-6 rounded-[32px] border-[1px] border-dark-light/10"
              style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
              <Input
                label="Reset Token"
                value={resetToken}
                onChangeText={setResetToken}
                placeholder="Enter token from email"
                icon="shield-checkmark-outline"
                autoCapitalize="none"
              />

              <Input
                label="New Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                icon="lock-closed-outline"
                style={{marginTop: 16}}
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
                title="Reset Password"
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
