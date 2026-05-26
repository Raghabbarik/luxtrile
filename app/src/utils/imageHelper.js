import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Alert, Platform, PermissionsAndroid} from 'react-native';

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const pickImage = async (multiple = false, includeBase64 = true) => {
  const options = {
    mediaType: 'photo',
    quality: 0.7,
    maxWidth: 1024,
    maxHeight: 1024,
    selectionLimit: multiple ? 0 : 1,
    includeBase64: includeBase64,
  };

  try {
    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage);
      return null;
    }

    if (multiple) {
      return result.assets.map(asset => ({
        uri: asset.uri,
        type: asset.type,
        fileName: asset.fileName,
        fileSize: asset.fileSize,
        base64: includeBase64 ? `data:${asset.type};base64,${asset.base64}` : undefined,
      }));
    }

    return {
      uri: result.assets[0].uri,
      type: result.assets[0].type,
      fileName: result.assets[0].fileName,
      fileSize: result.assets[0].fileSize,
      base64: includeBase64 ? `data:${result.assets[0].type};base64,${result.assets[0].base64}` : undefined,
    };
  } catch (error) {
    console.error('Image picker error:', error);
    return null;
  }
};

export const takePhoto = async () => {
  const hasPermission = await requestCameraPermission();

  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Camera permission is required');
    return null;
  }

  const options = {
    mediaType: 'photo',
    quality: 0.8,
    includeBase64: true,
  };

  try {
    const result = await launchCamera(options);

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage);
      return null;
    }

    return {
      uri: result.assets[0].uri,
      base64: `data:${result.assets[0].type};base64,${result.assets[0].base64}`,
    };
  } catch (error) {
    console.error('Camera error:', error);
    return null;
  }
};
