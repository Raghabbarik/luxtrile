import React from 'react';
import {View, Text} from 'react-native';
import {colors} from '../theme/colors';

const StatusBadge = ({status}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return colors.status.success;
      case 'pending':
        return colors.status.warning;
      case 'cancelled':
      case 'failed':
        return colors.status.error;
      default:
        return colors.text.tertiary;
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View
      className="px-3 py-1 rounded-full"
      style={{backgroundColor: `${getStatusColor()}20`}}>
      <Text
        className="text-xs font-semibold"
        style={{color: getStatusColor()}}>
        {getStatusText()}
      </Text>
    </View>
  );
};

export default StatusBadge;
