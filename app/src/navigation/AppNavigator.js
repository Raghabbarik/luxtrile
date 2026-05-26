import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OwnerLoginScreen from '../screens/auth/OwnerLoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import SalonRegistrationScreen from '../screens/auth/SalonRegistrationScreen';
import SalonDetailsScreen from '../screens/auth/SalonDetailsScreen';
import Salon360ViewScreen from '../screens/auth/Salon360ViewScreen';
import SalonServicesScreen from '../screens/auth/SalonServicesScreen';
import ClientNavigator from './ClientNavigator';
import OwnerNavigator from './OwnerNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {isAuthenticated, user, loading} = useAuth();

  console.log('AppNavigator render:', {isAuthenticated, userRole: user?.role, loading});

  if (loading) {
    return <SplashScreen />;
  }

  // Determine initial route based on auth state
  const getInitialRouteName = () => {
    if (!isAuthenticated) return 'Welcome';
    return user?.role === 'client' ? 'ClientApp' : 'OwnerApp';
  };

  return (
    <NavigationContainer 
      key={isAuthenticated ? `auth-${user?.role}` : 'guest'}
      onReady={() => console.log('Navigation ready')}>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OwnerLogin" component={OwnerLoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="SalonRegistration" component={SalonRegistrationScreen} />
            <Stack.Screen name="SalonDetails" component={SalonDetailsScreen} />
            <Stack.Screen name="Salon360View" component={Salon360ViewScreen} />
            <Stack.Screen name="SalonServices" component={SalonServicesScreen} />
          </>
        ) : user?.role === 'client' ? (
          <Stack.Screen name="ClientApp" component={ClientNavigator} />
        ) : user?.role === 'salon_owner' ? (
          <Stack.Screen name="OwnerApp" component={OwnerNavigator} />
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
