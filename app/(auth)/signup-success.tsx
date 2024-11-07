import * as React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { Color } from "../../constants/LoginGlobalStyles";
import { router, useLocalSearchParams } from "expo-router";
import HeaderBar from "@/components/HeaderBar";

type SignupSuccessText = {
  name: string;
};

const Middle: React.FC<SignupSuccessText> = ({ name }) => {
  const searchParams = useLocalSearchParams();
  const nickname = searchParams.nickname || "";
  return (
    <View style={styles.middle}>
      <HeaderBar title="회원가입" isMain={false} />
      <View style={[styles.welcomeText, styles.loginButtonBg]}>
        <Text style={[styles.text, styles.textFlexBox]}>{nickname}님, 가입을 환영합니다.</Text>
      </View>
      <Pressable style={[styles.loginButton, styles.loginButtonBg]} onPress={() => { router.push('/(auth)/login'); }}>
        <Text style={styles.loginButtonText}>로그인 하러 가기</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  loginButtonBg: {
    overflow: "hidden",
  },
  textFlexBox: {
    justifyContent: "center",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    color: Color.colorBlack,
    width: "100%",
    alignSelf: "stretch",
  },
  welcomeText: {
    flexDirection: "row",
    padding: 10,
    alignSelf: "stretch",
  },
  loginButton: {
    borderRadius: 8,
    width: "80%",
    height: 69,
    backgroundColor: Color.colorBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: 20,
    color: Color.colorWhite,
    textAlign: "center",
  },
  middle: {
    flex: 1,
    width: "100%",
    paddingVertical: 50,
    gap: 20,
    alignItems: "center",
    backgroundColor: Color.colorWhite,
  },
});

export default Middle;
