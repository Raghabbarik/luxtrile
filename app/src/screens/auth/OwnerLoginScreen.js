import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {colors} from '../../theme/colors';

const OwnerLoginScreen = ({navigation}) => {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-8 py-12">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mb-8">
              <Icon name="arrow-back" size={28} color={colors.white} />
            </TouchableOpacity>

            <View className="items-center mb-8">
              <Icon name="business" size={80} color={colors.gold.primary} />
            </View>

            <View className="mb-8">
              <Text className="text-white text-4xl font-bold mb-2 text-center">
                Salon Owner Login
              </Text>
              <Text className="text-text-secondary text-base text-center">
                Manage your salon business
              </Text>
            </View>

            <View
              className="p-6 rounded-[32px] border-[1px] border-dark-light/10"
              style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="owner@salon.com"
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
                style={{marginTop: 16}}
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
                onPress={handleLogin}
                loading={loading}
                style={{marginTop: 24}}
              />

              <View className="flex-row items-center justify-center mt-6">
                <Text className="text-text-tertiary text-sm">
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SalonRegistration')}>
                  <Text className="text-gold-500 text-sm font-bold">
                    Register Salon
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

export default OwnerLoginScreen;
