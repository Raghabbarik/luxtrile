import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

const FilterChip = ({label, selected, onPress, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 ${
        selected ? 'bg-gold-500' : 'bg-dark-200'
      }`}
      style={style}>
      <Text
        className={`text-sm font-semibold ${
          selected ? 'text-white' : 'text-text-secondary'
        }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterChip;
