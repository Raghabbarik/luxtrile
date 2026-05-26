import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const LoginScreen = ({ navigation, route }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <View className="flex-1 bg-dark-primary">
      {/* Decorative Background Elements */}
      <View
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: colors.gold.soft,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: colors.gold.soft,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-8 py-12">
            {/* Logo */}
            <View className="items-center mb-8">
              <Icon name="person-circle" size={80} color={colors.gold.primary} />
            </View>

            <View className="mb-8">
              <Text className="text-white text-4xl font-bold mb-2 text-center">
                Welcome Back
              </Text>
              <Text className="text-text-secondary text-base text-center">
                Login to continue
              </Text>
            </View>

            <View
              className="p-6 rounded-[32px] border-[1px] border-dark-light/10"
              style={{ backgroundColor: 'rgba(28, 28, 30, 0.4)' }}>
              
              <Text className="text-text-secondary text-sm mb-4 text-center">
                Enter your email
              </Text>

              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                keyboardType="email-address"
                icon="mail-outline"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                icon="lock-closed-outline"
                style={{ marginTop: 16 }}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                className="self-end mt-2">
                <Text className="text-gold-500 text-sm font-semibold">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleSignIn}
                loading={loading}
                style={{ marginTop: 24 }}
              />

              <View className="mt-8 pt-6 border-t border-dark-light">
                <TouchableOpacity 
                  onPress={() => navigation.navigate('OwnerLogin')}
                  className="items-center">
                  <Text className="text-text-secondary text-sm mb-2">
                    Are you a business owner?
                  </Text>
                  <Text className="text-gold-500 text-base font-bold">
                    Salon Owner Login
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-center mt-6">
                <Text className="text-text-tertiary text-sm">
                  New to Luxtril?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text className="text-gold-500 text-sm font-bold">
                    Create an account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
