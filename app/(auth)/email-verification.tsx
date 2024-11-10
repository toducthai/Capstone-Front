import HeaderBar from '@/components/HeaderBar';
import InputField from '@/components/InputField';
import { Href, router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const contentHeight = height - 100; // 상단과 하단 바의 높이를 각각 50으로 설정했으므로, 총 100을 뺌

const EmailVerificationScreen: React.FC = () => {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [verificated, setVerificated] = useState<boolean | null>(null);

	return (
		<SafeAreaView style={styles.container}>
			<HeaderBar title="비밀번호 찾기" isMain={false} />
			<View style={styles.content}>
				<Text style={styles.logo}>TRAVEL MAIKER</Text>
				<Text style={styles.title}>비밀번호 찾기</Text>
				<Text style={styles.subtitle}>
					이메일 주소로 인증 코드를 받고 비밀번호를 재설정 해주세요.
				</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>아이디</Text>
					<View style={styles.inputRow}>
						{/* <InputField title="이메일 아이디" value={email} onChangeText={setEmail} secureTextEntry={false} />*/}
						<TextInput
							style={styles.input}
							placeholder="이메일 주소를 입력해주세요"
							placeholderTextColor="#aaa"
							value={email} onChangeText={setEmail} secureTextEntry={false}
						/>
						<TouchableOpacity
							style={[
								styles.button,
								{ backgroundColor: email.length > 0 ? '#000' : '#ccc' } // 텍스트 입력 상태에 따른 버튼 색상 변경
							]}
							disabled={email.length === 0} // 이메일이 없으면 버튼 비활성화
						>
							<Text style={styles.buttonText}>인증요청</Text>
						</TouchableOpacity>
					</View>

					<Text style={styles.label}>인증 코드</Text>
					<View style={styles.inputRow}>
						<TextInput
							style={styles.input}
							placeholder="인증 코드 6자를 입력하세요."
							placeholderTextColor="#aaa"
							value={code} onChangeText={setCode} secureTextEntry={false}
						/>
						<TouchableOpacity
							style={[
								styles.button,
								{ backgroundColor: code.length > 0 ? '#000' : '#ccc' } // 텍스트 입력 상태에 따른 버튼 색상 변경
							]}
							disabled={code.length === 0} // 이메일이 없으면 버튼 비활성화
							onPress={()=>{
								if(code === "123456"){
									setVerificated(true);
									alert("인증이 완료되었습니다.");
								}
								else{
									setVerificated(false);
									alert("인증에 실패하였습니다.");
								}
							}}
						>
							<Text style={styles.buttonText}>확인</Text>
						</TouchableOpacity>
					</View>
				</View>

				<TouchableOpacity style={[
					styles.continueButton,
					{ backgroundColor: verificated ? '#000' : '#ccc' }
					]}
					disabled={!verificated} 
					onPress={()=>{
						if(verificated){
							router.push('/password-setting');
						}
					}}>
					<Text style={styles.continueButtonText}>계속</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		//flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		//height: contentHeight,
		width: width * 0.9,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#82D9FF',
		//color: '#ff4500',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
		marginBottom: 30,
	},
	inputContainer: {
		width: '100%',
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		marginBottom: 5,
		color: '#333',
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
	},
	input: {
		flex: 1,
		height: 50,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 8,
		paddingLeft: 10,
		marginRight: 10,
		color: '#333',
	},
	button: {
		height: 50,
		paddingHorizontal: 15,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ccc',
		borderRadius: 8,
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	continueButton: {
		width: '100%',
		height: 50,
		backgroundColor: '#ccc',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		marginTop: 20,
	},
	continueButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default EmailVerificationScreen;
