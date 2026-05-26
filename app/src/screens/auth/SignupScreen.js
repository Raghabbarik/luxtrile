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
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const SignupScreen = ({ navigation, route }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
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
    const result = await register(name, email, password, phone, 'client', 'male');
    setLoading(false);

    if (!result.success) {
      Alert.alert('Signup Failed', result.message);
    }
  };

  return (
    <View className="flex-1 bg-dark-primary">
      <View
        style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
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
            <View className="mb-8">
              <Text className="text-white text-4xl font-bold mb-2">
                Create Account
              </Text>
              <Text className="text-text-secondary text-base">
                Join Luxtril today
              </Text>
            </View>

            <View
              className="p-6 rounded-[32px] border-[1px] border-dark-light/10"
              style={{ backgroundColor: 'rgba(28, 28, 30, 0.4)' }}>
              
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                icon="person-outline"
              />

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="john@example.com"
                keyboardType="email-address"
                icon="mail-outline"
                style={{marginTop: 16}}
              />

              <Input
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 234 567 890"
                keyboardType="phone-pad"
                icon="call-outline"
                style={{marginTop: 16}}
              />

              <Input
                label="Password"
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
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
                style={{ marginTop: 24 }}
              />

              <View className="flex-row items-center justify-center mt-6">
                <Text className="text-text-tertiary text-sm">
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="text-gold-500 text-sm font-bold">
                    Sign In
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

export default SignupScreen;
