import { Platform } from 'react-native';

export const API_URL = Platform.select({
  ios: 'http://10.61.10.222:3000',
  android: 'http://10.61.10.222:3000',
  default: 'http://10.61.10.222:3000',
});