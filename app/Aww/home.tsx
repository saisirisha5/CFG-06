import React, { useState } from "react";
import { 
  FlatList, 
  Image, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Dimensions,
  Platform,
  StatusBar
} from "react-native";
import Header from "../Header";
import AppBar from '../Appbar';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Define responsive scaling functions
const scale = (size: number) => (screenWidth / 320) * size;
const verticalScale = (size: number) => (screenHeight / 568) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Get status bar height for Android
const getStatusBarHeight = () => {
  return Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
};

const mothers = [
  { id: '1', name: 'Asha Devi', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: '2', name: 'Sunita Kumari', img: 'https://randomuser.me/api/portraits/women/66.jpg' },
  { id: '3', name: 'Meena Singh', img: 'https://randomuser.me/api/portraits/women/67.jpg' },
];

const history = [
  { id: '4', name: 'Radha Patel', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: '5', name: 'Kavita Joshi', img: 'https://randomuser.me/api/portraits/women/69.jpg' },
];

const resources = [
  { id: '1', title: 'Nutrition for Mothers', desc: 'Learn about essential nutrition during pregnancy.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { id: '2', title: 'Child Vaccination', desc: 'A guide to child vaccination schedules.', img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
  { id: '3', title: 'Mental Health', desc: 'Tips for maintaining mental health for mothers.', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3a3a8a" />
      <Header />
      <View style={styles.body}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* My Assigned Mothers */}
          <Text style={styles.sectionTitle}>My Assigned Mothers</Text>
          <FlatList
            data={mothers}
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
            contentContainerStyle={styles.horizontalListContent}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.profileCard}>
                <Image source={{ uri: item.img }} style={styles.avatar} />
                <Text style={styles.profileName} numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* History */}
          <Text style={styles.sectionTitle}>History</Text>
          <FlatList
            data={history}
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
            contentContainerStyle={styles.horizontalListContent}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.profileCard}>
                <Image source={{ uri: item.img }} style={styles.avatar} />
                <Text style={styles.profileName} numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Resources */}
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.resourcesContainer}>
            {resources.map(resource => (
              <TouchableOpacity key={resource.id} style={styles.resourceCard}>
                <Image source={{ uri: resource.img }} style={styles.resourceImg} />
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle} numberOfLines={2}>
                    {resource.title}
                  </Text>
                  <Text style={styles.resourceDesc} numberOfLines={3}>
                    {resource.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <AppBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a3a8a',
  },
  body: {
    flex: 1,
    backgroundColor: '#f7f7fa',
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(80), // Extra padding for app bar
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#3a3a8a',
    marginBottom: verticalScale(8),
    marginTop: verticalScale(12),
    paddingHorizontal: scale(4),
  },
  horizontalList: {
    marginBottom: verticalScale(16),
  },
  horizontalListContent: {
    paddingHorizontal: scale(4),
  },
  profileCard: {
    alignItems: 'center',
    marginRight: scale(16),
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    minWidth: scale(100),
    maxWidth: scale(120),
  },
  avatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    marginBottom: verticalScale(8),
  },
  profileName: {
    fontSize: moderateScale(15),
    color: '#222',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  resourcesContainer: {
    paddingHorizontal: scale(4),
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(14),
    padding: moderateScale(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    minHeight: verticalScale(80),
  },
  resourceImg: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(8),
    marginRight: scale(12),
  },
  resourceContent: {
    flex: 1,
    justifyContent: 'center',
  },
  resourceTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#3a3a8a',
    marginBottom: verticalScale(4),
    lineHeight: moderateScale(20),
  },
  resourceDesc: {
    fontSize: moderateScale(14),
    color: '#444',
    lineHeight: moderateScale(18),
  },
});