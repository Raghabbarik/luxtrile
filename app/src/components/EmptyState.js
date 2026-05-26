import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../theme/colors';
import Button from './Button';

const EmptyState = ({icon, title, message, actionText, onAction}) => {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Icon name={icon} size={80} color={colors.text.tertiary} />
      <Text className="text-text-primary text-xl font-bold mt-6 text-center">
        {title}
      </Text>
      <Text className="text-text-tertiary text-base font-regular mt-2 text-center">
        {message}
      </Text>
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          variant="outline"
          style={{marginTop: 24}}
        />
      )}
    </View>
  );
};

export default EmptyState;
