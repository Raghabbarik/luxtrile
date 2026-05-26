import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

const Header = ({
  title,
  subtitle,
  showBack = false,
  rightIcon,
  onRightPress,
  transparent = false,
}) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View
        className={`flex-row items-center justify-between px-6 pt-12 pb-4 ${transparent ? 'bg-transparent' : 'bg-dark-primary'
          }`}
        style={!transparent ? {
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        } : {}}>
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3 w-10 h-10 items-center justify-center rounded-full bg-dark-tertiary/50 border-[1px] border-dark-light/20">
              <Icon name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
          )}
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold tracking-tight">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-text-secondary text-xs uppercase tracking-[2px] font-bold mt-1">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-dark-tertiary/50 border-[1px] border-dark-light/20">
            <Icon name={rightIcon} size={22} color={colors.gold.primary} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default Header;
