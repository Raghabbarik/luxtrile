import {Alert} from 'react-native';

export const handleApiError = error => {
  if (error.response) {
    const message = error.response.data?.message || 'Something went wrong';
    const status = error.response.status;

    if (status === 401) {
      return 'Unauthorized. Please login again.';
    } else if (status === 403) {
      return 'Access denied.';
    } else if (status === 404) {
      return 'Resource not found.';
    } else if (status === 500) {
      return 'Server error. Please try again later.';
    }

    return message;
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

export const showErrorAlert = (title, error) => {
  const message = handleApiError(error);
  Alert.alert(title, message);
};
