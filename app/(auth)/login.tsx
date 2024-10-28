import * as React from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable, Image, SafeAreaView } from "react-native";
import { Color, Border, FontSize, Padding, Gap } from "../../constants/LoginGlobalStyles";
import HeaderBar from "../../components/HeaderBar";
import InputField from "@/components/InputField";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useAuth } from '../AuthContext';

const Middle = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { redirect } = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        {/*<HeaderBar isMain={false} title="로그인" />*/}
        <View style={styles.middle}>
          <View style={styles.originLogin}>
            <View style={styles.inputContainer}>
              <InputField title="이메일 아이디" value={email} onChangeText={setEmail} secureTextEntry={false} />
              <InputField title="비밀번호" value={password} onChangeText={setPassword} secureTextEntry={true} />
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxWrapper}>
                <View style={styles.checkBox} />
                <Text style={styles.checkboxText}>아이디 저장</Text>
              </View>
              <View style={styles.checkboxWrapper}>
                <View style={styles.checkBox} />
                <Text style={styles.checkboxText}>자동 로그인</Text>
              </View>
            </View>

            <Pressable style={styles.loginButton} onPress={() => {
              if (email == "admin" && password == "1234") {
                login();
                const redirectTo = Array.isArray(redirect) ? redirect[0] : redirect || "/(tabs)/index";
                router.replace(redirectTo as Href<string>);
              }
              else {
                alert("로그인 정보가 올바르지 않습니다.");
                router.push('/login')
              }
            }}>
              <View style={styles.loginButtonBackground} />
              <Text style={styles.loginButtonText}>로그인</Text>
            </Pressable>

            <View style={styles.utilityContainer}>
              <Pressable onPress={() => { }}>
                <Text style={styles.utilityText}>비밀번호 찾기</Text>
              </Pressable>
              <View style={styles.utilityDivider} />
              <Pressable onPress={() => { router.push('/signup'); }}>
                <Text style={styles.utilityText}>회원가입</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.socialLoginContainer}>
            <View style={styles.socialLoginHeader}>
              <View style={styles.divider} />
              <Text style={styles.socialLoginText}>간편 로그인</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialButtonGroup}>
              <Image style={styles.socialLogo} resizeMode="cover" source={require("../../assets/images/Logo_Naver.png")} />
              <Image style={styles.socialLogo} resizeMode="cover" source={require("../../assets/images/Logo_Kakao.png")} />
              <Image style={styles.socialLogo} resizeMode="cover" source={require("../../assets/images/Logo_Google.png")} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  middle: {
    flex: 1,
    width: "100%",
    gap: 10,
    alignItems: "center",
    backgroundColor: Color.colorWhite,
  },
  originLogin: {
    paddingVertical: 30,
    gap: 14,
    paddingHorizontal: Padding.p_base,
    backgroundColor: Color.colorWhite,
    alignItems: "center",
    alignSelf: "stretch",
  },
  inputContainer: {
    gap: Gap.gap_md,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  checkboxContainer: {
    flexDirection: "row",
    gap: 39,
    paddingVertical: Padding.p_8xl,
    paddingHorizontal: Padding.p_8xl,
    alignSelf: "stretch",
  },
  checkboxWrapper: {
    flexDirection: "row",
    gap: Gap.gap_md,
    alignItems: "center",
  },
  checkBox: {
    width: 24,
    height: 24,
    backgroundColor: Color.colorGainsboro,
    borderRadius: Border.br_7xs,
  },
  checkboxText: {
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    textAlign: "left",
  },
  loginButton: {
    height: 50,
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorWhite,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Padding.p_base,
  },
  loginButtonBackground: {
    bottom: 1,
    backgroundColor: Color.colorBlack,
    height: 68,
    width: "100%",
    alignSelf: "stretch",
    borderRadius: Border.br_7xs,
    position: "absolute",
  },
  loginButtonText: {
    fontSize: 20,
    color: Color.colorWhite,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 66,
    width: "100%",
  },
  utilityContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  utilityText: {
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    textAlign: "center",
  },
  utilityDivider: {
    borderColor: Color.colorBlack,
    borderRightWidth: 1,
    width: 1,
    height: 15,
    borderStyle: "solid",
  },
  socialLoginContainer: {
    paddingVertical: 20,
    gap: 10,
    backgroundColor: Color.colorWhite,
    alignItems: "center",
    alignSelf: "stretch",
  },
  socialLoginHeader: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    borderColor: Color.colorDimgray,
    borderTopWidth: 1,
    width: 137,
    height: 1,
  },
  socialLoginText: {
    color: Color.colorBlack,
    fontSize: FontSize.size_mini,
    textAlign: "center",
  },
  socialButtonGroup: {
    flexDirection: "row",
    gap: 32,
    height: 124,
    justifyContent: "center",
  },
  socialLogo: {
    height: 65,
    width: 64,
    borderRadius: Border.br_5xs,
  },
});

export default Middle;