// app/my-travel.tsx
import HeaderBar from '@/components/HeaderBar';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../AuthContext';
import Schedule from '../schedule';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TravelCardProps {
  imageUrl: string;
  title: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  itinerary: string[];
  setCheck: (check: boolean) => void;
}

// TravelCard 컴포넌트
const TravelCard: React.FC<TravelCardProps> = ({ imageUrl, title, startDate, endDate, peopleCount, itinerary, setCheck }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.info}>시작일: {startDate}</Text>
        <Text style={styles.info}>종료일: {endDate}</Text>
        <Text style={styles.info}>인원: {peopleCount}명</Text>

        {itinerary.map((day, index) => (
          <Text key={index} style={styles.itinerary}>
            {day}
          </Text>
        ))}

        <TouchableOpacity style={styles.detailButton} onPress={() => { setCheck(true); }}>
          <Text style={styles.detailButtonText}>클릭하여 자세히 보기 &gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MyTravelScreen() {
  const travelData = [
    {
      imageUrl: 'https://via.placeholder.com/100',
      title: '여행 이름 : 제주 여행',
      startDate: '24년 09월 20일',
      endDate: '24년 09월 22일',
      peopleCount: 6,
      itinerary: [
        '1일차 : 공항 -> 어디 -> 어디 -> 숙소',
        '2일차 : 1100고지 -> 점심 -> 실탄 사격 -> 산방산 -> 숙소',
        '3일차 : 오설록 티 뮤지엄 -> 공항',
      ],
    },
    {
      imageUrl: 'https://via.placeholder.com/100',
      title: '여행 이름 : 000님의 여행',
      startDate: '24년 10월 28일',
      endDate: '24년 10월 29일',
      peopleCount: 4,
      itinerary: [
        '1일차 : 신라스테이 해운대점 -> 더베이 101',
        '2일차 : 밀양순대국밥 해운대점 -> 해운대 해수욕장',
      ],
    },
  ];

  
  const router = useRouter();

  //login 부분 임시 차단

  //const { isAuthenticated, logout } = useAuth();
  /*useEffect(() => {
    if (!isAuthenticated) {
      const redirectTimeout = setTimeout(() => {
        router.push({ pathname: '/(auth)/login', params: { redirect: '/(tabs)/my-travel' } });
      }, 1000); // 100ms 지연 후 리다이렉트

      return () => clearTimeout(redirectTimeout); // 클린업 함수로 타임아웃 해제
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return null;
  }*/

  // 현재 내 여행의 구조는 자세히 보기를 클릭 시 
  // 세부 내용으로 컴포넌트가 바뀌게 설계되어 있음.
  // 잘못된 설계이니 뜯어 고쳐 사용하는 것을 권장. 
  const [check, setCheck] = useState<boolean | null>(false);
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <HeaderBar isMain={false} title="내 여행" />
      {!check ? (
        <ScrollView contentContainerStyle={styles.container}>
          {travelData.map((item, index) => (
            <TravelCard
              key={index}
              imageUrl={item.imageUrl}
              title={item.title}
              startDate={item.startDate}
              endDate={item.endDate}
              peopleCount={item.peopleCount}
              itinerary={item.itinerary}
              setCheck={setCheck}
            />
          ))}
        </ScrollView>
      ) : (
        <View>
          <Schedule />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 16,
  },
  infoContainer: {
    //flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  itinerary: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  detailButton: {
    marginTop: 10,
  },
  detailButtonText: {
    fontSize: 12,
    color: '#888',
  },
});