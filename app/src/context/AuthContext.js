import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
    
    // Fallback timeout in case loading gets stuck
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout - forcing completion');
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  const loadStoredAuth = async () => {
    try {
      console.log('Loading stored auth...');
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      console.log('Token exists:', !!storedToken);
      console.log('User exists:', !!storedUser);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      console.log('Auth loading complete');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {email, password});
      const {user: userData, token: userToken} = response.data.data;

      await AsyncStorage.setItem('token', userToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);

      return {success: true};
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password, phone, role, gender) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        role,
        gender,
      });
      const {user: userData, token: userToken} = response.data.data;

      await AsyncStorage.setItem('token', userToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Save gender to AsyncStorage
      if (gender) {
        await AsyncStorage.setItem('userGender', gender);
      }

      setToken(userToken);
      setUser(userData);

      return {success: true};
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout...');
      
      // Clear all auth data
      await AsyncStorage.multiRemove(['token', 'user', 'userGender']);
      
      // Update state immediately
      setToken(null);
      setUser(null);
      
      console.log('Logout successful - state cleared');
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if AsyncStorage fails, clear the state
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
        logout,
        updateUser,
        isAuthenticated: !!token,
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
