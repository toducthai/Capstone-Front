import * as React from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Color, Border, FontSize, Padding, Gap } from "../../constants/LoginGlobalStyles";
import InputField from "@/components/InputField";
import { router } from "expo-router";

const Middle = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [psCheck, setPsCheck] = useState("");
  const [nickname, setNickname] = useState("");

  return (
    <View style={styles.middle}>
      <View style={styles.inputContainer}>
        <InputField title="이메일 아이디" value={email} onChangeText={setEmail} secureTextEntry={false} />
      </View>
      <View style={styles.inputContainer}>
        <InputField title="비밀번호" value={password} onChangeText={setPassword} secureTextEntry={true} />
      </View>
      <View style={styles.inputContainer}>
        <InputField title="비밀번호 확인" value={psCheck} onChangeText={setPsCheck} secureTextEntry={true} />
        <Text style={styles.passwordCheckText}>{password === psCheck ? "일치" : "불일치"}</Text>
      </View>
      <View style={styles.inputContainer}>
        <InputField title="별명" value={nickname} onChangeText={setNickname} secureTextEntry={false} />
      </View>
      <Pressable style={styles.signUpButton} onPress={() => {
        if(password === psCheck)
          router.push({pathname:"./signup-success", params: {nickname}})
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

export default Middle;