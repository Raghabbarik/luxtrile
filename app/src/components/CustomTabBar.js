import {View, TouchableOpacity, Text, StyleSheet, Platform, Animated} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme/colors';
import {useEffect, useRef} from 'react';

const CustomTabBar = ({state, descriptors, navigation}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 4,
          height: 68 + insets.bottom,
        },
      ]}>
      {/* Glassmorphism background */}
      <View style={styles.background}>
        <View style={styles.glassEffect} />
      </View>

      {/* Tab items */}
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Get icon name
          let iconName;
          if (route.name === 'Home') {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings' || route.name === 'OwnerBookings') {
            iconName = isFocused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile' || route.name === 'OwnerProfile') {
            iconName = isFocused ? 'person' : 'person-outline';
          } else if (route.name === 'DashboardTab') {
            iconName = isFocused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Services') {
            iconName = isFocused ? 'cut' : 'cut-outline';
          }

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              iconName={iconName}
              label={label}
              options={options}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabItem = ({route, isFocused, onPress, onLongPress, iconName, label, options}) => {
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.9)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1 : 0.9,
        useNativeDriver: true,
        friction: 8,
        tension: 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: isFocused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={styles.tabItem}>
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{scale: scaleAnim}],
            opacity: opacityAnim,
          },
        ]}>
        {isFocused ? (
          <LinearGradient
            colors={colors.gold.metallic}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.activeTabBackground}>
            <View style={styles.activeIndicator} />
            <Icon name={iconName} size={22} color={colors.white} />
            <Text style={styles.activeLabel}>{label}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.inactiveTab}>
            <Icon name={iconName} size={22} color={colors.text.tertiary} />
            <Text style={styles.inactiveLabel}>{label}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark.secondary,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(212, 175, 55, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -8},
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  glassEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    backdropFilter: 'blur(20px)',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabBackground: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: colors.gold.primary,
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    width: 24,
    height: 3,
    backgroundColor: colors.white,
    borderRadius: 2,
    opacity: 0.9,
  },
  inactiveTab: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 2,
    minWidth: 60,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inactiveLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.tertiary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
});

export default CustomTabBar;
