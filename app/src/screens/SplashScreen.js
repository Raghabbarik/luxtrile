import React from 'react';
import {View, Text, ActivityIndicator, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme/colors';

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={[colors.dark.primary, colors.dark.secondary, colors.dark.primary]}
      className="flex-1 items-center justify-center">
      {/* Circular Logo Container */}
      <View className="items-center mb-12">
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../logo.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Brand Name */}
      <View className="items-center mb-8">
        <Text className="text-white text-5xl font-bold tracking-tight">
          Luxtril<Text className="text-gold-500">.</Text>
        </Text>
        <View className="h-1 w-20 bg-gold-500 rounded-full mt-3" />
      </View>

      {/* Tagline */}
      <Text className="text-text-secondary text-base tracking-wide mb-16 px-8 text-center">
        Premium Salon Booking Experience
      </Text>

      {/* Loading Indicator */}
      <ActivityIndicator size="large" color={colors.gold.primary} />

      {/* Version */}
      <View className="absolute bottom-12">
        <Text className="text-text-tertiary text-xs tracking-widest">
          VERSION 1.0.0
        </Text>
      </View>

      {/* Decorative Elements */}
      <View
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: colors.gold.soft,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 250,
          height: 250,
          borderRadius: 125,
          backgroundColor: colors.gold.soft,
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  circleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.gold.soft,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  circleInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.dark.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold.primary,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: colors.dark.primary,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
