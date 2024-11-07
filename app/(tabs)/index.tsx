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
  const [days, setDays] = useState<{ day: number, places: { id: number, name: string, address: string, imageUrl: string }[] }[]>([{
    day: 1,
    places: [
      { id: 1, name: '해운대 해수욕장', address: '부산광역시 해운대구', imageUrl: '' }
    ]
  }]); // 여행 계획 일차 상태로 관리
  const [places, setPlaces] = useState([{ placeid: 1, title: '광안리 해수욕장', areaCode: '21', sigunguCode: '4', address: '부산광역시 수영구', contentid: '12345', contenttypeid: '12', tel: '051-123-4567', modifiedtime: '20240101', imageUrl: " ", checked: false },
  // { placeid: 2, title: '태종대', areaCode: '21', sigunguCode: '3', mapx: '129.08', mapy: '35.05', address: '부산광역시 영도구', contentid: '67890', contenttypeid: '12', tel: '051-765-0987', modifiedtime: '20240102', imageUrl:" ", checked: false },
  ]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: '안녕하세요! 반가워요 :D',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: '동글이',
          avatar: '',
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (messages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const userMessage = messages[0].text;
    const additionalInfo = {
      userId: 1,
      timestamp: new Date().toISOString(),
      address: '부산광역시 해운대구', // 예시 정보
      daysInfo: days
    };
    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
        token: 'your-token', // 적절한 인증 토큰을 추가하세요.
        user_id: 1, // 사용자 ID
        chatroom_id: 'chatroom-123', // 채팅방 ID (예시)
        user_input: userMessage, // 사용자 메시지
        user_selected_places: places.map(place => ({
          placeid: place.placeid,
          title: place.title,
          areaCode: 'areaCode-example',
          sigunguCode: 'sigunguCode-example',
          mapx: 'mapx-example',
          mapy: 'mapy-example',
          address: place.address,
          contentid: 'contentid-example',
          contenttypeid: 'contenttypeid-example',
          tel: 'tel-example',
          modifiedtime: new Date().toISOString(),
          // eventstartdate: place.eventstartdate || null,
          // eventenddate: place.eventenddate || null,
          summary: 'summary-example',
          checked: place.checked
        })),
        user_selected_schedule: days.map(day => ({
          day: day.day,
          places: day.places.map(place => ({
            placeid: place.id,
            title: place.name,
            address: place.address
          }))
        }))
      });

      const userId = response.data.user_id;
      const chatroomId = response.data.chatroom_id;
      const botMessage = response.data.model_output;
      const recommendedPlaces = response.data.recommended_places;
      console.log(recommendedPlaces)
      setPlaces(recommendedPlaces.map((place, index) => ({ ...place, id: index + 1, checked: false })));

      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: botMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: '동글이',
          avatar: ' ',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    } catch (error) {
      console.error('Error sending message to server:', error);
      // setPlaces([]);
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: "메세지가 전달되지 못했습니다.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: '동글이',
          avatar: ' ',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    }
  }, []);

  const openSelectModal = () => {
    if (planModalVisible) {
      closePlanModal();
    }
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
    if (selectModalVisible) {
      closeSelectModal();
    }
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
      {/* <View style={styles.headerContainer}>
        <Text style={styles.headerText}>TRAVEL MAIKER</Text>
      </View> */}
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
          <View style={styles.buttonContainer}>
            <Text style={styles.modalHeaderText}>여행지 선택</Text>
            {/* 닫기 버튼 */}
            <TouchableOpacity style={styles.closeSelectButton} onPress={closeSelectModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {places.map(place => (
              <View key={place.placeid} style={styles.placeCard}>
                <TouchableOpacity style={styles.checkboxContainer}
                  onPress={() => {
                    setPlaces(prevPlaces => prevPlaces.map(p => p.placeid === place.placeid ? { ...p, checked: !p.checked } : p));
                  }}
                >
                  <View style={[styles.checkbox, place.checked && styles.checkedCheckbox]}></View>
                </TouchableOpacity>
                <View style={styles.placeInfo}>
                  <View style={styles.imageContainer}>
                    <img src={place.imageUrl} style={styles.placeImage} alt={place.title} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.placeName}>{place.title}</Text>
                    <Text style={styles.placeLocation}>위치: {place.address}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* 추가 버튼 */}
          <TouchableOpacity style={styles.completeButton} onPress={() => {
            // 체크된 여행지를 선택한 일차에 추가
            const selectedPlaces = places.filter(place => place.checked);
            setDays(prevDays => {
              const updatedDays = [...prevDays];
              selectedPlaces.forEach(place => {
                const dayIndex = updatedDays.length - 1;
                updatedDays[dayIndex].places.push();
              });
              return updatedDays;
            });
            // 체크된 여행지 상태 초기화
            setPlaces(prevPlaces => prevPlaces.map(place => ({ ...place, checked: false })));
            closeSelectModal();
          }}
          >
            <Text style={styles.completeButtonText}>추가</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {/* 여행 계획 모달 */}
      {planModalVisible && (
        <Animated.View style={[styles.animatedModalLeft, { transform: [{ translateX: slideAnimLeft }] }]}>
          <View style={styles.buttonContainer}>
            <Text style={styles.modalHeaderText}>여행 계획</Text>
            <TouchableOpacity style={styles.closeScheduleButton} onPress={closePlanModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {/* 여러 일차의 일정들 */}
            {days.map((day) => (
              <View key={day.day} style={styles.dayContainer}>
                <Text style={styles.dayText}>Day{day.day}</Text>
                {day.places.map((place) => (
                  <View key={place.id} style={styles.placeCard}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    {/* 일정 삭제 버튼 */}
                    <TouchableOpacity style={styles.deleteScheduleButton} onPress={() => {
                      setDays(prevDays => prevDays.map(d => {
                        if (d.day === day.day) {
                          return { ...d, places: d.places.filter(p => p.id !== place.id) };
                        }
                        return d;
                      }));
                    }}
                    >
                      <Text style={styles.deleteScheduleText}>-</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
            {/* 일정 추가 버튼 */}
            <TouchableOpacity
              style={styles.addScheduleButton}
              onPress={() => {
                setDays(prevDays => [
                  ...prevDays,
                  { day: prevDays.length + 1, places: [] }
                ]);
              }}
            >
              <Text style={styles.addScheduleText}>+</Text>
            </TouchableOpacity>
          </ScrollView>
          {/*저장 버튼 컨테이너 */}
          <TouchableOpacity style={styles.saveScheduleButton} onPress={() => { /* 저장 로직 구현 */ }}>
            <Text style={styles.saveButtonText}>저장하기</Text>
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
    alignSelf: 'flex-end',
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 15,
  },
  closeSelectButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0e0e0',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveScheduleButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
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
    fontSize: 15,
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
    fontSize: 12,
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
