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

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email.trim().toLowerCase());
      Alert.alert(
        'Email Sent',
        'Password reset email has been sent to your inbox. Check your email and follow the link to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error) {
      let message = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
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
      <Header title="Forgot Password" showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-8 py-8">
            <View className="items-center mb-8">
              <View className="w-24 h-24 rounded-full bg-gold-500/20 items-center justify-center mb-4">
                <Icon name="lock-closed" size={48} color={colors.gold.primary} />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                Reset Password
              </Text>
              <Text className="text-text-secondary text-center">
                Enter your email address and we'll send you a link to reset your
                password
              </Text>
            </View>

            <View
              className="p-6 rounded-[32px] border-[1px] border-dark-light/10"
              style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                keyboardType="email-address"
                icon="mail-outline"
                autoCapitalize="none"
              />

              <Button
                title="Send Reset Link"
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

export default ForgotPasswordScreen;
