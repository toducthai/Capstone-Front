import React, { useState, useCallback, useEffect } from 'react';
import { Alert, SafeAreaView, View, Text, Dimensions, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { height, width } = Dimensions.get("window");

// endpoint url
const CHAT_URL = 'http://localhost:3000';
const SAVE_URL = 'http://localhost:3000';

export default function Home() {
  // IMessage 배열 타입을 명시적으로 설정
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [slideAnimLeft] = useState(new Animated.Value(-width)); // 왼쪽 모달의 시작 위치 설정
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width)); // 오른쪽 모달의 시작 위치 설정
  const [days, setDays] = useState<{ day: number, places: { placeid: number, title: string, areaCode: number, sigunguCode: number, address: string, contentid: Number, contenttypeid: number, tel: String }[] }[]>([{
    day: 1,
    places: [
      { placeid: 1, title: '광안리 해수욕장', areaCode: 21, sigunguCode: 4, address: '부산광역시 수영구', contentid: 12345, contenttypeid: 12, tel: '051-123-4567' }
    ]
  }]); // 여행 계획 일차 상태로 관리
  const [places, setPlaces] = useState([{ placeid: 1, title: '광안리 해수욕장', areaCode: 21, sigunguCode: 4, address: '부산광역시 수영구', contentid: 12345, contenttypeid: 12, tel: '051-123-4567', checked: false },
  ]);
  const [selectedPlaces, setSelectedPlaces] = useState([{}]);
  const [chatroomId, setChatroomId] = useState<string | null>(null); // chatroomId 상태 추가
  // 여행 날짜 상태 추가
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDate, setIsStartDate] = useState(true); // 시작일 선택 여부를 위한 상태
  const [isTravelStarted, setIsTravelStarted] = useState(false); // 여행 시작 여부를 관리하는 상태 추가
  const [daySelectionModalVisible, setDaySelectionModalVisible] = useState(false);

  // 처음 유저에게 보내는 메세지
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

  // 채팅을 진행할 것
  const onSend = useCallback(async (messages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const userMessage = messages[0].text;

    try {
      const response = await axios.post(CHAT_URL, {
        token: "sample_token_1234",
        areaCode: "01",
        contenttypeid: "12",
        chatroom_id: "chatroom_5678",
        user_input: "User input example text",
        user_selected_places: selectedPlaces.map(place => ({
          // placeid: place.placeid,
          // title: place.title,
          // areaCode: place.areaCode,
          // sigunguCode: place.sigunguCode,
          // address: place.address,
          // contentid: place.contentid,
          // contenttypeid: place.contenttypeid,
          // tel: place.tel,
        })),
        user_selected_schedule: days.map(day => ({
          day: day.day,
          places: day.places.map(place => ({
            placeid: "place.placeid",
            title: "place.title",
            address: "place.address",
            mapx: "127.02758",
            mapy: "37.49794",
            areaCode: "place.areaCode",
            sigunguCode: "place.sigunguCode",
            contentid: "place.contentid",
            contenttypeid: "place.contenttypeid",
            tel: "place.tel",
            summary: "This is a sample place for testing purposes."
          })),
        })),
      });

      const userId = response.data.user_id;
      const receivedChatroomId = response.data.chatroom_id;
      setChatroomId(receivedChatroomId); // 서버에서 받은 chatroomId를 상태로 저장
      const botMessage = response.data.model_output;
      const recommendedPlaces = response.data.recommended_places;
      console.log(recommendedPlaces)
      setPlaces(recommendedPlaces.map((place, index) => ({ ...place, id: index + 1, checked: false })));
      setSelectedPlaces([]);

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
  }, [days, selectedPlaces]);

  // 일자 선택 모달
  const openDaySelectionModal = () => {
    setDaySelectionModalVisible(true);
  };

  const closeDaySelectionModal = () => {
    setDaySelectionModalVisible(false);
  };

  // 날짜 선택기 열기 및 닫기
  const showDatePicker = (isStart: boolean) => {
    setIsStartDate(isStart);
    setDatePickerVisible(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // 날짜 선택 후 콜백 함수
  const handleConfirm = (date: Date) => {
    if (isStartDate) {
      setStartDate(date);
      console.log("start date:", date);
    } else {
      setEndDate(date);
      console.log("end date:", date);
    }
    hideDatePicker();
  };

  // 여행 날짜 선택 후 채팅 시작
  const startChatWithDates = () => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        Alert.alert("오류", "여행 시작일은 종료일보다 앞서야 합니다.");
      } else {
        Alert.alert("여행 시작", `${startDate.toLocaleDateString()}부터 ${endDate.toLocaleDateString()}까지 여행을 계획합니다.`);
        const timeDifference = endDate.getTime() - startDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
        console.log(daysDifference)
        setIsTravelStarted(true); // 여행이 시작되었음을 표시
        // days 상태 업데이트: daysDifference만큼의 일수를 생성
        setDays(
          Array.from({ length: daysDifference }, (_, index) => ({
            day: index + 1,
            places: [],
          })))
      }
    } else {
      Alert.alert("날짜 선택", "여행 시작일과 종료일을 선택해주세요.");
    }
  };

  // 여행지 선택 모달창 여는 함수
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
  // 여행지 선택 모달창 닫는 함수
  const closeSelectModal = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectModalVisible(false));
  };

  // 여행 계획 모달창 여는 함수
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

  // 여행 계획 모달창 닫는 함수
  const closePlanModal = () => {
    Animated.timing(slideAnimLeft, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setPlanModalVisible(false));
  };

  const addSelectedPlacesToSpecificDay = (dayNumber: number) => {
    const selectedPlaces = places.filter(place => place.checked);
    setDays(prevDays => {
      return prevDays.map(day => {
        if (day.day === dayNumber) {
          const updatedPlaces = [...day.places];
          selectedPlaces.forEach(place => {
            const existingPlace = updatedPlaces.some(existing => existing.placeid === place.placeid);
            if (!existingPlace) {
              updatedPlaces.push({
                placeid: place.placeid,
                title: place.title,
                address: place.address,
                areaCode: place.areaCode,
                sigunguCode: place.sigunguCode,
                contentid: place.contentid,
                contenttypeid: place.contenttypeid,
                tel: place.tel,
              });
            }
          });
          return { ...day, places: updatedPlaces };
        }
        return day;
      });
    });
    // 체크된 여행지 상태 초기화
    setPlaces(prevPlaces => prevPlaces.map(place => ({ ...place, checked: false })));
    Alert.alert("추가되었습니다");
    closeDaySelectionModal();
    closeSelectModal();
  };


  // 일자 추가 함수 아마 이제 안 쓸 듯?
  const addNewDay = () => {
    setDays(prevDays => [
      ...prevDays,
      { day: prevDays.length + 1, places: [] }
    ]);
  };

  //여행지 추천 선택 함수
  const selectingPlaces = () => {
    // 체크된 여행지를 selectedPlaces에 추가
    const selectedPlacesList = places.filter(place => place.checked);
    setSelectedPlaces(prevSelected => [...prevSelected, ...selectedPlacesList]);
    Alert.alert('선택하였습니다', '선택된 여행지가 저장되었습니다.');
    closeSelectModal();
  }

  // 저장 모듈 (미구현)
  const saveSchedule = async () => {
    try {
      // const response = await axios.post('https://b612-121-150-80-104.ngrok-free.app/trips/create', {
      const response = await axios.post(SAVE_URL, {
        user_id: 123, // 사용자 ID (예시)
        chatroomid: chatroomId, // 채팅방 ID (예시)
        trip_name: '서울 여행', // 여행 이름 (예시)
        start_date: startDate, // 여행 시작 날짜 (예시)
        end_date: endDate, // 여행 종료 날짜 (예시)
        created_at: new Date().toISOString(), // 생성 시각
        trip_days: days.map(day => ({
          day: day.day,
          places: day.places.map(place => ({
            placeid: place.placeid,
            title: place.title,
            address: place.address,
            areaCode: place.areaCode,
            sigunguCode: place.sigunguCode,
            contentid: place.contentid,
            contenttypeid: place.contenttypeid,
            tel: place.tel
          })),
        })),
      });
      console.log('Schedule saved successfully:', response.data);
      Alert.alert('저장 완료', '여행 스케줄이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error saving schedule:', error);
      Alert.alert('저장 실패', '여행 스케줄 저장에 실패하였습니다.');
    }
  };

  // ================================================================================
  return (
    <SafeAreaView style={styles.container}>
      {!isTravelStarted && (
        <View style={{ padding: 20 }}>
          <TouchableOpacity style={styles.setPlanButton} onPress={() => showDatePicker(true)}>
            <Text style={styles.setButtonText}>여행 시작일 선택</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.setPlanButton} onPress={() => showDatePicker(false)}>
            <Text style={styles.setButtonText}>여행 종료일 선택</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.setPlanButton} onPress={startChatWithDates}>
            <Text style={styles.setButtonText}>여행 계획 시작하기</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* 날짜 선택 모달 */}
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {/* 날짜 선택 모달 */}
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {isTravelStarted && (
        <>
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
        </>
      )}

      {/* ====================== 여행지 선택 모달 =========================== */}
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
                {/* 체크박스 컨테이너 디자인 */}
                <TouchableOpacity style={styles.checkboxContainer}
                  onPress={() => {
                    setPlaces(prevPlaces => prevPlaces.map(p => p.placeid === place.placeid ? { ...p, checked: !p.checked } : p));
                  }}
                >
                  <View style={[styles.checkbox, place.checked && styles.checkedCheckbox]}></View>
                </TouchableOpacity>
                <View style={styles.placeInfo}>
                  <View style={styles.textContainer}>
                    <Text style={styles.placeName}>{place.title}</Text>
                    <Text style={styles.placeLocation}>위치: {place.address}</Text>
                    <Text style={styles.placeLocation}>전화: {place.tel}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* =========================== 추가 버튼 =============================*/}
          <TouchableOpacity style={styles.completeButton} onPress={openDaySelectionModal}>
            <Text style={styles.completeButtonText}>추가</Text>
          </TouchableOpacity>
          {daySelectionModalVisible && (
            <Animated.View style={[styles.animatedModal, { transform: [{ translateX: slideAnim }] }]}>
              <View style={styles.buttonContainer}>
                <Text style={styles.modalHeaderText}>어느 일차에 추가할까요?</Text>
                {/* 닫기 버튼 */}
                <TouchableOpacity style={styles.closeSelectButton} onPress={closeDaySelectionModal}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.scrollView}>
                {days.map(day => (
                  <TouchableOpacity key={day.day} style={styles.daySelectionButton} onPress={() => addSelectedPlacesToSpecificDay(day.day)}>
                    <Text style={styles.daySelectionText}>{day.day}일차</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}
          {/* 선택 버튼 추가 */}
          <TouchableOpacity style={styles.completeButton} onPress={selectingPlaces}>
            <Text style={styles.completeButtonText}>선택</Text>
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
                  <View key={place.placeid} style={styles.placeCard}>
                    <Text style={styles.placeName}>{place.title}</Text>
                    {/* 일정 삭제 버튼 */}
                    <TouchableOpacity style={styles.deleteScheduleButton} onPress={() => {
                      setDays(prevDays => prevDays.map(d => {
                        if (d.day === day.day) {
                          return { ...d, places: d.places.filter(p => p.placeid !== place.placeid) };
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
            {/* 일자 추가 버튼
            <TouchableOpacity style={styles.addScheduleButton} onPress={addNewDay}>
              <Text style={styles.addScheduleText}>+</Text>
            </TouchableOpacity> */}
          </ScrollView>
          {/* 저장 버튼 컨테이너 */}
          <TouchableOpacity style={styles.saveScheduleButton} onPress={saveSchedule}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // 여행 일자 선택
  setPlanButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  setButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  // daySelectionButton 스타일 추가
  daySelectionButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },

  // daySelectionText 스타일 추가
  daySelectionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
