import { Platform } from 'react-native'

const API_URL = Platform.select({
  web: 'http://localhost:8080',
  android: 'http://10.0.2.2:8080',
  ios: 'http://localhost:8080',
  default: 'http://localhost:8080',
})!

export default API_URL
