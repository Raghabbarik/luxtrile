import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme/colors';
import Card from './Card';

const StatCard = ({
  icon,
  value,
  label,
  variant = 'default',
  style,
}) => {
  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[colors.gold.primary, colors.gold.dark]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        className="rounded-2xl p-4"
        style={style}>
        <Icon name={icon} size={28} color={colors.white} />
        <Text className="text-white text-3xl font-bold mt-3">{value}</Text>
        <Text className="text-white text-sm mt-1 opacity-90">{label}</Text>
      </LinearGradient>
    );
  }

  return (
    <Card variant="glass" style={style}>
      <Icon name={icon} size={28} color={colors.gold.primary} />
      <Text className="text-text-primary text-3xl font-bold mt-3">
        {value}
      </Text>
      <Text className="text-text-secondary text-sm mt-1">{label}</Text>
    </Card>
  );
};

export default StatCard;
