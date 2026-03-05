import { createClient, AsyncStorageAdapter } from '@blinkdotnew/sdk'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as WebBrowser from 'expo-web-browser'

export const blink = createClient({
  projectId: process.env.EXPO_PUBLIC_BLINK_PROJECT_ID!,
  auth: {
    mode: 'headless',
    webBrowser: WebBrowser,
  },
  storage: new AsyncStorageAdapter(AsyncStorage)
})

// Helper to get project ID
export function getProjectId(): string {
  return process.env.EXPO_PUBLIC_BLINK_PROJECT_ID || 'agrilink-delivery-app-8dqb0sb3'
}
