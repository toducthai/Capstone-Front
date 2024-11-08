import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Location {
  imageUrl: string;
  name: string;
}

interface DayPlan {
  day: string;
  date: string;
  locations: Location[];
}

interface DayCardProps {
  dayPlan: DayPlan;
}

const DayCard: React.FC<DayCardProps> = ({ dayPlan }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.dayText}>{dayPlan.day} : {dayPlan.date}</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.locationContainer}>
        {dayPlan.locations.map((location, index) => (
          <View key={index} style={styles.locationCard}>
            <Image source={{ uri: location.imageUrl }} style={styles.locationImage} />
            <Text style={styles.locationText}>{location.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const Schedule: React.FC = () => {
  const travelPlans: DayPlan[] = [
    {
      day: '1일차',
      date: '24년 9월 20일',
      locations: [
        { imageUrl: 'https://via.placeholder.com/100', name: '대구 공항' },
        { imageUrl: 'https://via.placeholder.com/100', name: '제주 공항' },
      ],
    },
    {
      day: '2일차',
      date: '24년 9월 21일',
      locations: [
        { imageUrl: 'https://via.placeholder.com/100', name: '한라산 1100고지' },
        { imageUrl: 'https://via.placeholder.com/100', name: '고집돌우럭 종문점' },
      ],
    },
    {
        day: '3일차',
        date: '24년 9월 22일',
        locations: [
          { imageUrl: 'https://via.placeholder.com/100', name: '오설록 티뮤지엄' },
          { imageUrl: 'https://via.placeholder.com/100', name: '제주 공항' },
        ],
      },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {travelPlans.map((dayPlan, index) => (
        <DayCard key={index} dayPlan={dayPlan} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  locationCard: {
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  locationImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default Schedule;
