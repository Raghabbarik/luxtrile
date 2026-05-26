import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../theme/colors';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onSubmit,
  style,
}) => {
  return (
    <View
      className="flex-row items-center bg-dark-200 rounded-xl px-4 py-3"
      style={style}>
      <Icon name="search-outline" size={20} color={colors.text.tertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        className="flex-1 text-text-primary text-base ml-3"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Icon name="close-circle" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
