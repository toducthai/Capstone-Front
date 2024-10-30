// index.tsx (루트 페이지로, 메인 네비게이션 역할을 합니다.)
// ChatBot 메인 챗봇입니다, 서버 연동 추가 및 모달 UI 추가

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import axios from 'axios';

const { height, width } = Dimensions.get("window");

export default function Home() {
  // IMessage 배열 타입을 명시적으로 설정
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [slideAnimLeft] = useState(new Animated.Value(-width)); // 왼쪽 모달의 시작 위치 설정
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width)); // 오른쪽 모달의 시작 위치 설정
  const [days, setDays] = useState<number[]>([1]); // 여행 계획 일차 상태로 관리
  const [places, setPlaces] = useState([{ id: 1, name: '해운대 해수욕장', location: '부산광역시 해운대구', imageUrl: '' , checked: false}]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: '안녕하세요! 반가워요 :D',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (messages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const userMessage = messages[0].text;
    try {
      const response = await axios.post('https://your-server-endpoint.com/api/chat', {
        message: userMessage,
      });

      const botMessage = response.data.reply;
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: botMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatBot',
          avatar: 'https://placeimg.com/140/140/tech',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    } catch (error) {
      console.error('Error sending message to server:', error);
    }
  }, []);

  const openSelectModal = () => {
    setSelectModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSelectModal = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectModalVisible(false));
  };

  const openPlanModal = () => {
    setPlanModalVisible(true);
    Animated.timing(slideAnimLeft, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePlanModal = () => {
    Animated.timing(slideAnimLeft, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setPlanModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>TRAVEL MAIKER</Text>
      </View>
      <GiftedChat
        placeholder={'메세지를 입력하세요...'}
        alwaysShowSend={true}
        messages={messages}
        textInputProps={{ keyboardAppearance: 'dark', autoCorrect: false }}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {/* 추천 관광지 탭 버튼 */}
      <TouchableOpacity style={styles.checkboxButton} onPress={openSelectModal}>
        <Text style={styles.buttonText}>여행지 선택</Text>
      </TouchableOpacity>
      {/* 여행 계획 탭 버튼 */}
      <TouchableOpacity style={styles.planButton} onPress={openPlanModal}>
        <Text style={styles.buttonText}>여행 계획</Text>
      </TouchableOpacity>
      {/* 여행지 선택 모달 */}
      {selectModalVisible && (
        <Animated.View style={[styles.animatedModal, { transform: [{ translateX: slideAnim }] }]}>
          <Text style={styles.modalHeaderText}>여행지 선택</Text>
          <ScrollView style={styles.scrollView}>
            {places.map(place => (
              <View key={place.id} style={styles.placeCard}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => {
                    setPlaces(prevPlaces => prevPlaces.map(p => p.id === place.id ? { ...p, checked: !p.checked } : p));
                  }}
                >
                  <View style={[styles.checkbox, place.checked && styles.checkedCheckbox]}></View>
                </TouchableOpacity>
                <View style={styles.placeInfo}>
                  <View style={styles.imageContainer}>
                    <img src={place.imageUrl} style={styles.placeImage} alt={place.name} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeLocation}>위치: {place.location}</Text>
                    <TouchableOpacity style={styles.detailButton}>
                      <Text style={styles.detailButtonText}>클릭하여 자세히 보기 &gt;</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* 추가 버튼 */}
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => {
              // 체크된 여행지를 여행 계획 모달로 추가
              const selectedPlaces = places.filter(place => place.checked);
              setDays(prevDays => [...prevDays, ...selectedPlaces.map((_, index) => prevDays.length + index + 1)]);
              closeSelectModal();
            }}
          >
            <Text style={styles.completeButtonText}>추가</Text>
          </TouchableOpacity>
          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeSelectButton} onPress={closeSelectModal}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {/* 여행 계획 모달 */}
      {planModalVisible && (
        <Animated.View style={[styles.animatedModalLeft, { transform: [{ translateX: slideAnimLeft }] }]}>
          <Text style={styles.modalHeaderText}>여행 계획</Text>
          <ScrollView style={styles.scrollView}>
            {/* 여러 일차의 일정들 */}
            {days.map((day) => (
              <View key={day} style={styles.dayContainer}>
                <TouchableOpacity style={styles.dayButton}>
                  <Text style={styles.dayText}>{day}일차</Text>
                </TouchableOpacity>
                {/* 일정 삭제 버튼 */}
                <TouchableOpacity
                  style={styles.deleteScheduleButton}
                  onPress={() => {
                    // 일정 삭제 로직 구현: 삭제 후 일차 재정렬
                    setDays(prevDays => prevDays.filter(d => d !== day).map((d, index) => index + 1));
                  }}
                >
                  <Text style={styles.deleteScheduleText}>-</Text>
                </TouchableOpacity>
              </View>
            ))}
            {/* 일정 추가 버튼 */}
            <TouchableOpacity
              style={styles.addScheduleButton}
              onPress={() => {
                setDays(prevDays => [...prevDays, prevDays.length + 1]);
              }}
            >
              <Text style={styles.addScheduleText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeScheduleButton} onPress={closePlanModal}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: width,
    top: 50,
    zIndex: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "900",
  },
  animatedModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 20,
  },
  animatedModalLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 20,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: height * 0.5,
  },
  // Modal 창 스타일 ===== START
  checkboxButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 15,
  },
  planButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeScheduleButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 15,
  },
  closeSelectButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 15,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  deleteScheduleButton: {
    padding: 10,
    backgroundColor: '#dc3545', // 빨간색 배경
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteScheduleText: {
    color: 'white',
    fontSize: 20,
  },

  // Modal 창 스타일 ====== END
  planText: {
    fontSize: 18,
  },
  dayContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayButton: {
    flex: 1,
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addScheduleButton: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addScheduleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // 여행지 선택 모달 스타일
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    marginRight: 10,
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeLocation: {
    fontSize: 14,
    color: '#666',
  },
  detailButton: {
    marginTop: 5,
  },
  detailButtonText: {
    fontSize: 14,
    color: '#007BFF',
  },
  completeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#28a745',
    alignItems: 'center',
    borderRadius: 10,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  checkedCheckbox: {
    backgroundColor: '#6200ee',
  },

});
