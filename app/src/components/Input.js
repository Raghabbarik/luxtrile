import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  error,
  icon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={style}>
      {label && (
        <Text className="text-text-secondary text-xs uppercase tracking-widest font-bold mb-2 ml-1">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-dark-tertiary rounded-2xl px-4 ${multiline ? 'py-3' : 'py-0'
          } ${isFocused ? 'border-[1.5px] border-gold-500' : 'border-[1.5px] border-dark-light/20'}`}
        style={{
          backgroundColor: isFocused ? 'rgba(44, 44, 46, 0.8)' : 'rgba(28, 28, 30, 0.5)',
        }}>
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={isFocused ? colors.gold.primary : colors.text.tertiary}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          className="flex-1 text-text-primary text-base font-medium py-4"
          style={{ textAlignVertical: multiline ? 'top' : 'center' }}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Icon name={rightIcon} size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-status-error text-xs font-medium mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
