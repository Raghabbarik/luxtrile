import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import Input from '../../components/Input';
import Button from '../../components/Button';

const SalonRegistrationScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleContinue = () => {
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

    // Navigate to salon details screen
    navigation.navigate('SalonDetails', {
      ownerData: {name, email, phone, password},
    });
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-8 py-12">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-8">
            <Icon name="arrow-back" size={28} color={colors.white} />
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-white text-4xl font-bold mb-2">
              Register Your Salon
            </Text>
            <Text className="text-text-secondary text-base">
              Step 1 of 4 - Owner Details
            </Text>
          </View>

          <View
            className="p-6 rounded-[32px] border-[1px] border-dark-light/10 mb-6"
            style={{backgroundColor: 'rgba(28, 28, 30, 0.4)'}}>
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
              placeholder="owner@salon.com"
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
              title="Continue"
              onPress={handleContinue}
              style={{marginTop: 24}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SalonRegistrationScreen;
