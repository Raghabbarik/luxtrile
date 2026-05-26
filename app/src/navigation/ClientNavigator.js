import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CustomTabBar from '../components/CustomTabBar';

import ClientHomeScreen from '../screens/client/ClientHomeScreen';
import BookingsScreen from '../screens/client/BookingsScreen';
import ProfileScreen from '../screens/client/ProfileScreen';
import SalonDetailsScreen from '../screens/client/SalonDetailsScreen';
import ServiceSelectionScreen from '../screens/client/ServiceSelectionScreen';
import StaffSelectionScreen from '../screens/client/StaffSelectionScreen';
import TimeSlotScreen from '../screens/client/TimeSlotScreen';
import PaymentScreen from '../screens/client/PaymentScreen';
import BookingConfirmationScreen from '../screens/client/BookingConfirmationScreen';
import BookingDetailsScreen from '../screens/client/BookingDetailsScreen';
import HelpSupportScreen from '../screens/client/HelpSupportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ClientHome" component={ClientHomeScreen} />
      <Stack.Screen name="SalonDetails" component={SalonDetailsScreen} />
      <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
      <Stack.Screen name="StaffSelection" component={StaffSelectionScreen} />
      <Stack.Screen name="TimeSlot" component={TimeSlotScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
  );
};

const BookingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
};

const ClientNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Bookings" component={BookingsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default ClientNavigator;
