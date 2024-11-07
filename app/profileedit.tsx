import HeaderBar from '@/components/HeaderBar';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

const ProfileEdit = () => {
    const [nickname, setNickname] = useState('기존 별명'); // 기본 별명

    const handleProfileImageChange = () => {
        Alert.alert('알림', '프로필 사진 변경 기능은 아직 구현되지 않았습니다.');
    };

    const handleSave = () => {
        Alert.alert('알림', '개인 정보가 저장되었습니다.');
        // 실제 저장 로직은 여기서 처리
    };

    return (
        <View style={styles.container}>
            <HeaderBar title="개인 정보 수정" isMain={false} />
            <Text style={styles.title}>개인 정보 수정</Text>
            <View style={styles.profileImageContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/100' }} // 고정된 프로필 사진
                    style={styles.profileImage}
                />
                <TouchableOpacity onPress={handleProfileImageChange} style={styles.changePhotoButton}>
                    <Text style={styles.changePhotoText}>프로필 사진 변경</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>아이디</Text>
                <Text style={styles.infoText}>user123@example.com</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>별명</Text>
                <TextInput
                    style={styles.input}
                    placeholder="별명을 입력하세요"
                    placeholderTextColor="#aaa"
                    value={nickname}
                    onChangeText={setNickname}
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    changePhotoButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    changePhotoText: {
        color: '#333',
        fontSize: 14,
    },
    infoContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        color: '#333',
    },
    saveButton: {
        height: 50,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileEdit;
