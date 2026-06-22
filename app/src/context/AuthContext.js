import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import api from '../config/api';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '836001145607-olt09726n6amkj0c2dji1d3698gupn8u.apps.googleusercontent.com',
});

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial load from AsyncStorage to show profile quickly if cached
    loadStoredAuth();

    // 2. Listen to ID token changes (handles login, logout, token refresh)
    const unsubscribe = auth().onIdTokenChanged(async (firebaseUser) => {
      try {
        console.log('Firebase onIdTokenChanged:', !!firebaseUser);
        if (firebaseUser) {
          const userToken = await firebaseUser.getIdToken();
          await AsyncStorage.setItem('token', userToken);
          setToken(userToken);

          // Fetch profile from backend
          try {
            const response = await api.get('/auth/me');
            if (response.data?.success) {
              const userData = response.data.data.user;
              await AsyncStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
            }
          } catch (apiError) {
            console.log('Failed to fetch user profile in auth listener (could be new user registration):', apiError.message);
          }
        } else {
          // Logged out
          console.log('No Firebase user - clearing local auth state');
          await AsyncStorage.multiRemove(['token', 'user', 'userGender']);
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('onIdTokenChanged error:', error);
      } finally {
        setLoading(false);
      }
    });

    // Fallback timeout in case loading gets stuck
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout - forcing completion');
      setLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const loadStoredAuth = async () => {
    try {
      console.log('Loading stored auth...');
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      console.log('Stored token exists:', !!storedToken);
      console.log('Stored user exists:', !!storedUser);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      const userToken = await firebaseUser.getIdToken(true);
      await AsyncStorage.setItem('token', userToken);
      setToken(userToken);

      // Try to get full profile from backend
      try {
        const response = await api.get('/auth/me');
        const userData = response.data.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (apiError) {
        console.log('Backend /auth/me failed, using Firebase user data as fallback:', apiError.message);
        // Fallback: use Firebase user data so login still succeeds
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Minimal user from Firebase token so app can open
          const minimalUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || email,
            name: firebaseUser.displayName || email.split('@')[0],
            role: 'client',
            is_active: true,
          };
          await AsyncStorage.setItem('user', JSON.stringify(minimalUser));
          setUser(minimalUser);
        }
      }

      return {success: true};
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Login failed';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      return {success: false, message};
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, role, gender) => {
    try {
      setLoading(true);
      
      // 1. Create user in Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      // 2. Get ID token
      const userToken = await firebaseUser.getIdToken(true);
      
      // Save token temporarily so API interceptor can use it for the sync-user request
      await AsyncStorage.setItem('token', userToken);
      setToken(userToken);

      // 3. Call backend sync-user to create Firestore profile
      const response = await api.post('/auth/sync-user', {
        name,
        email,
        phone,
        role,
        gender,
      });

      const userData = response.data.data.user;

      // 4. Save profile to state and storage
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (gender) {
        await AsyncStorage.setItem('userGender', gender);
      }
      setUser(userData);

      return {success: true};
    } catch (error) {
      console.error('Registration error:', error);
      
      // Clean up Firebase user if sync failed so they can retry
      try {
        if (auth().currentUser) {
          await auth().currentUser.delete();
        }
      } catch (deleteError) {
        console.error('Failed to clean up Firebase user:', deleteError);
      }

      await AsyncStorage.multiRemove(['token', 'user', 'userGender']);
      setToken(null);
      setUser(null);

      let message = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'That email address is already in use!';
      } else if (error.code === 'auth/invalid-email') {
        message = 'That email address is invalid!';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      return {success: false, message};
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // 1. Trigger Google Sign-In flow
      const { idToken } = await GoogleSignin.signIn();

      // 2. Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // 3. Authenticate with Firebase Auth
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseUser = userCredential.user;
      
      const userToken = await firebaseUser.getIdToken(true);
      await AsyncStorage.setItem('token', userToken);
      setToken(userToken);

      // 4. Fetch user profile from Firestore /auth/me
      let userData;
      try {
        const response = await api.get('/auth/me');
        userData = response.data.data.user;
      } catch (meError) {
        console.log('Google user profile does not exist yet. Syncing new user...');
        // First-time login: create the user document in Firestore
        const response = await api.post('/auth/sync-user', {
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || '',
          role: 'client',
          gender: 'male', // default gender
        });
        userData = response.data.data.user;
      }

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return {success: true};
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return {
        success: false,
        message: error.message || 'Google Sign-In failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout...');
      await auth().signOut();
      try {
        await GoogleSignin.signOut();
      } catch (e) {}
      console.log('Logout successful - state cleared by Firebase listener');
    } catch (error) {
      console.error('Error logging out:', error);
      // Fallback manual clear if signOut fails
      await AsyncStorage.multiRemove(['token', 'user', 'userGender']);
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = async updatedUser => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        signInWithGoogle,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
