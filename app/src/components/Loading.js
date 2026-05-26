import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {colors} from '../theme/colors';

const Loading = ({message = 'Loading...'}) => {
  return (
    <View className="flex-1 bg-dark-primary items-center justify-center">
      <ActivityIndicator size="large" color={colors.gold.primary} />
      <Text className="text-text-secondary text-base mt-4">
        {message}
      </Text>
    </View>
  );
};

export default Loading;
