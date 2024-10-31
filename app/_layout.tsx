// _layout.tsx (이 파일은 기본 레이아웃을 설정하며, 각 페이지의 공통 레이아웃을 정의합니다.)
import { Stack } from 'expo-router/stack';
import React from 'react';
import { AuthProvider } from './AuthContext';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
