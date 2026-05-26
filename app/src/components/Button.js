import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = 'rounded-2xl items-center justify-center flex-row overflow-hidden';
    const sizeStyle = {
      small: 'px-4 py-2.5',
      medium: 'px-6 py-4',
      large: 'px-8 py-5',
    };

    return `${baseStyle} ${sizeStyle[size]}`;
  };

  const getTextStyle = () => {
    const baseStyle = 'font-bold tracking-wide';
    const sizeStyle = {
      small: 'text-xs',
      medium: 'text-base',
      large: 'text-lg',
    };

    return `${baseStyle} ${sizeStyle[size]}`;
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[{
          shadowColor: colors.gold.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
        }, style]}
        activeOpacity={0.85}>
        <LinearGradient
          colors={colors.gold.metallic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={getButtonStyle()}
          style={{ opacity: disabled ? 0.5 : 1 }}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              {icon && <View className="mr-2">{icon}</View>}
              <Text
                className={getTextStyle()}
                style={[{ color: colors.white, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }, textStyle]}>
                {title.toUpperCase()}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        className={`${getButtonStyle()} border-[1.5px] border-gold-500`}
        style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
        {loading ? (
          <ActivityIndicator color={colors.gold.primary} />
        ) : (
          <>
            {icon && <View className="mr-2">{icon}</View>}
            <Text
              className={getTextStyle()}
              style={[{ color: colors.gold.primary }, textStyle]}>
              {title.toUpperCase()}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={getButtonStyle()}
      style={[{ opacity: disabled ? 0.5 : 1 }, style]}>
      {loading ? (
        <ActivityIndicator color={colors.gold.primary} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text
            className={getTextStyle()}
            style={[{ color: colors.text.primary }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
