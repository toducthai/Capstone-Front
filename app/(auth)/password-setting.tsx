import HeaderBar from '@/components/HeaderBar';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordReset = () => {
    if (password === confirmPassword) {
      // 여기에 비밀번호 재설정 로직을 추가하세요 (예: 서버에 요청)
      Alert.alert('성공', '비밀번호가 재설정되었습니다.');
      router.push('/login');
    } else {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <View style={styles.container}>
        <HeaderBar title="비밀번호 재설정" isMain={false} />
      <Text style={styles.title}>비밀번호 재설정</Text>
      
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: password && confirmPassword && password === confirmPassword ? '#000' : '#ccc' }
        ]}
        onPress={handlePasswordReset}
        disabled={!password || !confirmPassword || password !== confirmPassword}
      >
        <Text style={styles.submitButtonText}>비밀번호 재설정</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    color: '#333',
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PasswordReset;
