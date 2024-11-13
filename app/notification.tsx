import React, { useState, useEffect, useRef } from 'react'; 
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,BackHandler, Image, PanResponder, Dimensions, StatusBar, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import axios from 'axios';
import moment from 'moment';
import fuzz from 'fuzzball';
import { AppState, AppStateStatus } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface Notification {
  schedule_time: string;
  content: string;
  notification_type: string;
}

type Hour = {
  datetime: string;
  temp: number;
  conditions: string;
};


const BACKGROUND_FETCH_TASK = 'background-fetch-task';
const BASE_URL = 'http://172.22.48.1:3000';
const screenWidth = Dimensions.get('window').width;

const fetchNotificationsForeground = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/schedule/1`);
    return response.data.map((notification: any) => ({
      content: notification.content || 'No Title',
      notification_type: notification.notification_type || 'No Content',
      schedule_time: notification.schedule_time,
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('Background fetch task started');
    const dailySchedule = await fetchNotificationsForeground();
    const tomorrow = moment().add(1, 'days').startOf('day');

    for (const notification of dailySchedule) {
      const notificationTime = moment(notification.schedule_time);
      if (notificationTime.isSame(tomorrow, 'day')) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notification.notification_type || 'Upcoming Travel Reminder',
            body: `You have a schedule at ${notificationTime.format('HH:mm')} - ${notification.content}`,
          },
          trigger: {
            date: tomorrow.toDate(),
          },
        });
      }
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } 
  catch (error) {
    console.error('Error fetching data in background:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => setAppState(nextAppState);
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);

    return () => appStateListener.remove();
  }, []);

  return appState;
};

const App = () => {
  const appState = useAppState();
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [notificationDetails, setNotificationDetails] = useState({
    scheduleTime: '...',
    notificationType: '...',
    content: 'There is no schedule today...',
  });
  const [weatherData, setWeatherData] = useState<Hour[]>([]);

  const fetchWeatherData = async () => {
    const today = new Date().toLocaleDateString('en-CA');
    
    //예비 link api
    //1: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/korea/2024-10-28?unitGroup=metric&include=hours&key=UQF742RPBLUUPB43XN8LJ3XX6&contentType=json&elements=datetime,temp,conditions&tz=Asia/Seoul`
    //2: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/korea/${today}?unitGroup=metric&include=hours&key=UQF742RPBLUUPB43XN8LJ3XX6&contentType=json&elements=datetime,temp,conditions&tz=Asia/Seoul`

    try {
      const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/korea/${today}?unitGroup=metric&include=hours&key=UQF742RPBLUUPB43XN8LJ3XX6&contentType=json&elements=datetime,temp,conditions&tz=Asia/Seoul`);
      const data = await response.json();
      if (data.days && data.days.length > 0) {
        const hours = data.days[0].hours.map((hour: any) => ({
          datetime: hour.datetime,
          temp: parseFloat((hour.temp - 16).toFixed(1)),
          conditions: hour.conditions,
        }));
        setWeatherData(hours);
      }
    } 
    catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (appState === 'active') {
      const currentTime = new Date().getTime();
      if (!lastFetchTime || currentTime - lastFetchTime > 60000) {
        fetchNotificationsForeground().then((notifications) => {
          const validNotification = notifications.find((notification: Notification) => {
            const notificationTime = new Date(notification.schedule_time).getTime();
            return Math.abs(notificationTime - currentTime) <= 30 * 60 * 1000;
          });

          if (validNotification) {
            setNotificationDetails({
              scheduleTime: validNotification.schedule_time,
              notificationType: validNotification.notification_type,
              content: validNotification.content,
            });
          }
          setLastFetchTime(currentTime);
        }).catch(error => {
          console.error('Error fetching notifications:', error);
          setNotificationDetails({
            scheduleTime: '...',
            notificationType: '...',
            content: 'There is no schedule today...',
          });
        });
      }
    }
  }, [appState, lastFetchTime]);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') alert('Permission not granted');
  };

  const setupBackgroundTaskIfNotRegistered = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
      if (isRegistered) await TaskManager.unregisterTaskAsync(BACKGROUND_FETCH_TASK);

      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 30 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } 
    catch (error) {
      console.error('Error registering background task:', error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    setupBackgroundTaskIfNotRegistered();
  }, []);

  const getWeatherIcon = (conditions: string) => {
    const sunnyConditions = ['Clear', 'Windy'];
    const cloudyConditions = ['Partly Cloudy', 'Cloudy', 'Overcast', 'Thunderstorm', 'Fog'];
    const rainyConditions = ['Rain', 'Light Rain', 'Heavy Rain', 'Snow', 'Light Snow'];

    const checkCondition = (list: string[]) => list.some(condition => fuzz.partial_ratio(conditions.toLowerCase(), condition.toLowerCase()) > 50);
    if (checkCondition(sunnyConditions)) return require('../assets/images/sunny.png');
    if (checkCondition(cloudyConditions)) return require('../assets/images/cloudy.png');
    if (checkCondition(rainyConditions)) return require('../assets/images/rainy.png');
    return null;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx > 0 && gestureState.x0 < screenWidth * 0.1,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) BackHandler.exitApp();
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => BackHandler.exitApp()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.todayNotification}>
        <Text style={styles.todayTitle}>Today</Text>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>
            Travel Schedule Time: {notificationDetails.scheduleTime || '...'}
            {'\n'}Notification: {notificationDetails.notificationType || '...'}
            {'\n'}Content: {notificationDetails.content || 'There is no schedule today...'}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.slice(0, 24).map((hour, index) => (
          <View key={index} style={styles.scheduleBoxLarge}>
            <Text style={styles.scheduleTime}>{hour.datetime?.substring(0, 5) || 'N/A'}</Text>
            <Text style={styles.scheduleWeather}>{hour.conditions}</Text>
            <Text style={styles.scheduleTemp}>{hour.temp}°C</Text>
            {getWeatherIcon(hour.conditions) && (
              <Image source={getWeatherIcon(hour.conditions)} style={styles.weatherIcon} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20, height: 80 },
  backButton: { padding: 10 },
  backText: { fontSize: 18 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  settingsButton: { padding: 10 },
  settingsText: { fontSize: 18 },
  todayNotification: { marginTop: 20 },
  todayTitle: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10 },
  contentBox: { padding: 15, borderWidth: 1, borderRadius: 10, borderColor: '#ddd', marginHorizontal: 2, marginBottom: 10 },
  contentText: { fontSize: 16 },
  scheduleBoxLarge: { width: 100, padding: 15, height: 150, marginRight: 10, borderWidth: 2, borderRadius: 10, borderColor: '#ddd', alignItems: 'center' },
  scheduleTime: { fontSize: 16, fontWeight: 'bold' },
  scheduleWeather: { fontSize: 14, color: '#555' },
  scheduleTemp: { fontSize: 14, color: '#333' },
  weatherIcon: { width: 40, height: 40, position: 'absolute', bottom: 5, right: 5 },
});

export default App;
