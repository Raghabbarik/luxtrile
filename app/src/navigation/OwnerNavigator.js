import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CustomTabBar from '../components/CustomTabBar';

import OwnerDashboardScreen from '../screens/owner/OwnerDashboardScreen';
import ManageServicesScreen from '../screens/owner/ManageServicesScreen';
import OwnerBookingsScreen from '../screens/owner/OwnerBookingsScreen';
import OwnerProfileScreen from '../screens/owner/OwnerProfileScreen';
import AddServiceScreen from '../screens/owner/AddServiceScreen';
import EditServiceScreen from '../screens/owner/EditServiceScreen';
import SalonSetupScreen from '../screens/owner/SalonSetupScreen';
import SlotsManagementScreen from '../screens/owner/SlotsManagementScreen';
import StaffManagementScreen from '../screens/owner/StaffManagementScreen';
import OwnerAnalyticsScreen from '../screens/owner/OwnerAnalyticsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={OwnerDashboardScreen} />
      <Stack.Screen name="SalonSetup" component={SalonSetupScreen} />
      <Stack.Screen name="OwnerAnalytics" component={OwnerAnalyticsScreen} />
      <Stack.Screen name="OwnerServices" component={ManageServicesScreen} />
      <Stack.Screen name="StaffManagement" component={StaffManagementScreen} />
    </Stack.Navigator>
  );
};

const ServicesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ManageServices" component={ManageServicesScreen} />
      <Stack.Screen name="AddService" component={AddServiceScreen} />
      <Stack.Screen name="EditService" component={EditServiceScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={OwnerProfileScreen} />
      <Stack.Screen name="SalonSetup" component={SalonSetupScreen} />
      <Stack.Screen name="SlotsManagement" component={SlotsManagementScreen} />
      <Stack.Screen name="StaffManagement" component={StaffManagementScreen} />
    </Stack.Navigator>
  );
};

const OwnerNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{tabBarLabel: 'Dashboard'}}
      />
      <Tab.Screen name="Services" component={ServicesStack} />
      <Tab.Screen
        name="OwnerBookings"
        component={OwnerBookingsScreen}
        options={{tabBarLabel: 'Bookings'}}
      />
      <Tab.Screen
        name="OwnerProfile"
        component={ProfileStack}
        options={{tabBarLabel: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

export default OwnerNavigator;
