import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* My Assigned Mothers */}
          <Text style={styles.sectionTitle}>My Assigned Mothers</Text>
          <FlatList
            data={mothers}
            horizontal
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.profileCard} onPress={() => router.push("/Aww/MotherProfile")}>
                <Image source={{ uri: item.img }} style={styles.avatar} />
                <Text style={styles.profileName}>{item.name}</Text>
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
            style={{ marginBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.profileCard} onPress={() => router.push("/Aww/MotherProfile")}>
                <Image source={{ uri: item.img }} style={styles.avatar} />
                <Text style={styles.profileName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          {/* Resources */}
          <Text style={styles.sectionTitle}>Resources</Text>
          {resources.map(resource => (
            <View key={resource.id} style={styles.resourceCard}>
              <Image source={{ uri: resource.img }} style={styles.resourceImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDesc}>{resource.desc}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* Bottom App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.appBarBtn}><Text style={styles.appBarIcon}>🏠</Text></TouchableOpacity>
        <TouchableOpacity style={styles.appBarBtn}><Text style={styles.appBarIcon}>👩‍🍼</Text></TouchableOpacity>
        <TouchableOpacity style={styles.appBarBtn}><Text style={styles.appBarIcon}>📚</Text></TouchableOpacity>
        <TouchableOpacity style={styles.appBarBtn}><Text style={styles.appBarIcon}>⚙️</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3a3a8a',
    paddingTop: 18,
    paddingBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  body: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a3a8a',
    marginBottom: 8,
    marginTop: 12,
  },
  profileCard: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 100,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    textAlign: 'center',
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  resourceImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a3a8a',
    marginBottom: 4,
  },
  resourceDesc: {
    fontSize: 14,
    color: '#444',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 56,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  appBarBtn: {
    flex: 1,
    alignItems: 'center',
  },
  appBarIcon: {
    fontSize: 26,
    color: '#111',
  },
});
