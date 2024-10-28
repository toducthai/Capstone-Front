// app/my-page.tsx
import React, {useEffect} from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../AuthContext';  // 로그인 여부를 확인하기 위해 useAuth 사용
import { useRouter } from 'expo-router';

export default function MyPageScreen() {
  const {isAuthenticated, logout} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(!isAuthenticated){
      router.push({pathname: '/(auth)/login', params: {redirect: '/(tabs)/my-page'}});
    }
  }, [isAuthenticated]);

  if(!isAuthenticated){
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>마이페이지</Text>
    </View>
  );
}