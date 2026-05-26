import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';

const Card = ({
  children,
  onPress,
  variant = 'default',
  style,
  className = '',
}) => {
  const baseClass = 'rounded-[24px] p-5 overflow-hidden';

  if (variant === 'glass') {
    const content = (
      <View
        className={`${baseClass} ${className}`}
        style={[
          {
            backgroundColor: 'rgba(28, 28, 30, 0.6)',
            borderWidth: 1.5,
            borderColor: 'rgba(245, 158, 11, 0.1)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          },
          style,
        ]}>
        {children}
      </View>
    );

    return onPress ? (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    ) : (
      content
    );
  }

  if (variant === 'gradient') {
    const content = (
      <LinearGradient
        colors={[colors.gold.primary, colors.gold.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${baseClass} ${className}`}
        style={[
          {
            shadowColor: colors.gold.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 15,
            elevation: 8,
          },
          style,
        ]}>
        {children}
      </LinearGradient>
    );

    return onPress ? (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    ) : (
      content
    );
  }

  const content = (
    <View
      className={`${baseClass} bg-dark-tertiary ${className}`}
      style={[
        {
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.05)',
        },
        style,
      ]}>
      {children}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      {content}
    </TouchableOpacity>
  ) : (
    content
  );
};

export default Card;
