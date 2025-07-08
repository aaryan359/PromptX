import { Platform } from 'react-native';

export const API_URL = Platform.select({
  ios: 'https://promptx-backend.onrender.com',
  android: 'https://promptx-backend.onrender.com',
  default: 'https://promptx-backend.onrender.com',
});