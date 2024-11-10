import * as React from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable, Button } from "react-native";
import { Color, Border, FontSize, Padding, Gap } from "../../constants/LoginGlobalStyles";
import InputField from "@/components/InputField";
import { router } from "expo-router";
import HeaderBar from "@/components/HeaderBar";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [psCheck, setPsCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleValidation = () => {
    setIsValid(validateEmail(email));
  };

  const signup_handler = async () => {
    try{
      const response = await fetch('https://mywebsite.com/endpoint/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: {email},
          password: {password},
          nickname: {nickname},
        }),
      });
    } catch (error) {
      console.error(error);
    } 
  };

  return (
    <View style={styles.middle}>
      <HeaderBar title="회원가입" isMain={false} />
      <View style={styles.inputContainer}>
        <InputField title="이메일 아이디" value={email} onChangeText={setEmail} secureTextEntry={false} />
        <Button title="검증" onPress={handleValidation} />
        {isValid !== null && (
          <Text style={{ color: isValid ? 'green' : 'red' }}>
            {isValid ? '유효한 이메일입니다.' : '유효하지 않은 이메일입니다.'}
          </Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <InputField title="비밀번호" value={password} onChangeText={setPassword} secureTextEntry={true} />
      </View>
      <View style={styles.inputContainer}>
        <InputField title="비밀번호 확인" value={psCheck} onChangeText={setPsCheck} secureTextEntry={true} />
        {password.length !== 0 && (
          <Text style={{ color: password === psCheck ? 'green' : 'red' }}>
            {password === psCheck ? "일치" : "불일치"}
          </Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <InputField title="별명" value={nickname} onChangeText={setNickname} secureTextEntry={false} />
      </View>
      <Pressable style={styles.signUpButton} onPress={() => {
        if (!isValid) {
          alert("유효하지 않은 이메일입니다.");
        }
        else if (password !== psCheck) {
          alert("비밀번호가 일치하지 않습니다.");
        }
        else if(nickname === null){
          alert("별명을 작성해주세요.")
        }
        else{
          signup_handler();
          router.push({ pathname: "./signup-success", params: { nickname } })
        }
      }}>
        <View style={styles.signUpButtonBackground} />
        <Text style={styles.signUpButtonText}>회원가입</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  middle: {
    flex: 1,
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
  inputContainer: {
    paddingHorizontal: Padding.p_base,
    gap: Gap.gap_md,
    alignSelf: "stretch",
  },
  passwordCheckText: {
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    marginTop: 4,
  },
  signUpButton: {
    height: 68,
    width: 328,
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorWhite,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButtonBackground: {
    position: "absolute",
    backgroundColor: Color.colorBlack,
    height: 68,
    width: 328,
    borderRadius: Border.br_7xs,
  },
  signUpButtonText: {
    fontSize: 20,
    color: Color.colorWhite,
    textAlign: "center",
    position: "absolute",
  },
});

export default SignUp;