import * as React from "react";
import { useEffect } from "react";
import { Text, StyleSheet, View, Image, ImageBackground, Pressable } from "react-native";
import { Padding, Color, FontSize, Border, Gap } from "../../constants/LoginGlobalStyles";
import HeaderBar from "../../components/HeaderBar";
import { useAuth } from "../AuthContext";
import { Href, useRouter } from "expo-router";

export default function MyPageScreen() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push({ pathname: '/(auth)/login', params: { redirect: '/(tabs)/my-page' } });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.middle}>
      <HeaderBar title="마이페이지" isMain={false} />
      <View style={[styles.profileContainer, styles.commonPadding]}>
        <Image style={styles.icon} resizeMode="cover" source={require("../../assets/images/bead.png")} />
        <Text style={styles.nicknameText}>처음보는 닉네임</Text>
        <View style={styles.buttonContainer}>
          <View style={[styles.button]}>
            <Pressable>
              <Text style={styles.buttonText}>개인 정보</Text>
            </Pressable>
          </View>
          <View style={[styles.button]}>
            <Pressable onPress={() => {
              router.push('/(tabs)/')
              //logout(); 
              }}>
              <Text style={styles.buttonText}>로그 아웃</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={[styles.travelSummaryContainer, styles.commonBorder]}>
        <View style={styles.travelOption}>
          <Image style={styles.travelIcon} resizeMode="cover" source={require("../../assets/images/react-logo.png")} />
          <Text style={styles.travelText}>지난 여행</Text>
        </View>
        <View style={styles.travelOption}>
          <Image style={styles.travelIcon} resizeMode="cover" source={require("../../assets/images/react-logo.png")} />
          <Text style={styles.travelText}>찜한 여행</Text>
        </View>
        <View style={styles.travelOption}>
          <Image style={styles.travelIcon} resizeMode="cover" source={require("../../assets/images/react-logo.png")} />
          <Text style={styles.travelText}>최근 본 여행</Text>
        </View>
      </View>
      <View style={styles.currentPlanContainer}>
        <Text style={styles.currentPlanText}>현재 계획중인 여행</Text>
        <View style={styles.planListContainer}>
          {[1, 2].map((_, index) => (
            <View key={index} style={[styles.planItem, styles.planItemBorder]}>
              <View style={{flexDirection: "row", alignItems: "stretch"}}>
                <ImageBackground style={styles.planImage} resizeMode="cover" source={require("../../assets/images/react-logo.png")}>
                  
                </ImageBackground>
                <View style={styles.planDetails}>
                  <Text style={styles.planText}>{`여행 이름 : 제주 여행
시작일 : 24년 09월 20일
종료일 : 24년 09월 22일
인원 : 6인`}</Text>
                </View>
              </View>
              <View style={styles.planDetailLink}>
                <Text style={styles.planDetailText}>클릭하여 자세히 보기 &gt;</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  middle: {
    flex: 1,
    width: "100%",
    paddingVertical: 35,
    gap: 22,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    backgroundColor: Color.colorWhite,
  },
  commonPadding: {
    paddingHorizontal: Padding.p_base,
  },
  commonBorder: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: Color.colorDarkgray,
    borderRadius: Border.br_mini,
    overflow: "hidden",
  },
  profileContainer: {
    gap: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  icon: {
    height: 40,
    width: 40,
  },
  nicknameText: {
    fontSize: FontSize.size_mini,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    width: "50%",
  },
  button: {
    height: 30,
    borderRadius: Border.br_mini,
    borderWidth: 2,
    borderColor: Color.colorDarkgray,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  buttonText: {
    textAlign: "center",
    fontSize: FontSize.size_xs,
    fontWeight: "600",
    color: Color.colorBlack,
  },
  travelSummaryContainer: {
    flexDirection: "row",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  travelOption: {
    width: 110,
    alignItems: "center",
  },
  travelIcon: {
    height: 40,
    width: 40,
  },
  travelText: {
    lineHeight: 24,
    textAlign: "center",
    fontSize: FontSize.size_mini,
    color: Color.colorBlack,
  },
  currentPlanContainer: {
    gap: Gap.gap_md,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    flex: 1,
    alignSelf: "stretch",
  },
  currentPlanText: {
    fontSize: 24,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "left",
  },
  planListContainer: {
    gap: Gap.gap_md,
  },
  planItem: {
    flexDirection: "column", 
    backgroundColor: Color.colorWhite,
    borderColor: Color.colorBlack,
    borderRadius: Border.br_3xs,
    height: "50%",
    width: "100%", // 전체 너비 사용
    justifyContent: "center", // 아이템을 양쪽에 배치
    paddingHorizontal: Padding.p_base, // 양쪽 여백 추가
    alignItems: "center",
  },
  planItemBorder: {
    borderWidth: 2,
    borderStyle: "solid",
  },
  planImage: {
    width: 100,
    height: 100,
    borderRadius: Border.br_5xs,
    overflow: "hidden",
  },
  planImageText: {
    fontSize: FontSize.size_6xl,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "center",
    position: "absolute",
    top: 0,
    left: 0,
    height: 150,
    width: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  planDetails: {
    flex: 1, // 남은 공간을 모두 차지
    marginLeft: 10, // 이미지와 텍스트 간의 여백 추가
    height: "100%",
    justifyContent: "center",
  },
  planText: {
    fontSize: FontSize.size_xs,
    fontWeight: "600",
    color: Color.colorBlack,
    textAlign: "left",
    alignItems: "center",
  },
  planDetailLink: {
    width: "100%",
    height: 30,
  },
  planDetailText: {
    color: Color.colorGray,
    textAlign: "right",
    width: "100%",
    height: 30,
  },
});
