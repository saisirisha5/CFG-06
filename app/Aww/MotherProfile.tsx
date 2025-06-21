import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Header from "../Header";
import AppBar from "../Appbar";
import { useLanguage } from "../LanguageContext";

const { width: screenWidth } = Dimensions.get("window");

const scale = (size: number) => {
  const baseWidth = 320;
  const scaleFactor = screenWidth / baseWidth;
  const maxScale = 1.5;
  return size * Math.min(scaleFactor, maxScale);
};

// Responsive dimensions
const getResponsiveDimensions = () => {
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;
  return {
    isTablet,
    isLargeScreen,
    containerPadding: isLargeScreen ? 24 : isTablet ? 20 : 16,
    cardWidth: isLargeScreen ? 140 : isTablet ? 120 : 100,
    cardMaxWidth: isLargeScreen ? 160 : isTablet ? 140 : 120,
    avatarSize: isLargeScreen ? 70 : isTablet ? 64 : 56,
  };
};

interface Summary {
  weight: string;
  hb: string;
  bp: string;
  risk: string;
}

interface FamilyMember {
  name: string;
  relation: string;
  age: number;
}

interface Mother {
  id: string;
  name: string;
  age: string;
  week: string;
  lastVisit: string;
  nextVisit: string;
  img: string;
  summary: Summary;
  tips: string[];
  notes: string;
  family: FamilyMember[];
}

export default function MotherProfile() {
  const params = useLocalSearchParams();
  const { familyId, name } = params;
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");
  const responsive = getResponsiveDimensions();
  const router = useRouter(); // Get the router instance using useRouter();

  const mothers: Mother[] = [
    {
      id: '1',
      name: 'mother_1_name',
      age: '26',
      week: '32',
      lastVisit: '2025-06-01',
      nextVisit: '2025-06-30',
      img: 'https://randomuser.me/api/portraits/women/65.jpg',
      summary: {
        weight: '58 kg',
        hb: '11.5 g/dL',
        bp: '110/70 mmHg',
        risk: 'None',
      },
      tips: ['tip_1_1', 'tip_1_2', 'tip_1_3', 'tip_1_4'],
      notes: 'notes_1',
      family: [
        { name: 'family_1_1_name', relation: 'family_1_1_relation', age: 30 },
        { name: 'family_1_2_name', relation: 'family_1_2_relation', age: 60 },
        { name: 'family_1_3_name', relation: 'family_1_3_relation', age: 5 },
      ],
    },
    {
      id: '2',
      name: 'mother_2_name',
      age: '29',
      week: '20',
      lastVisit: '2025-05-20',
      nextVisit: '2025-06-15',
      img: 'https://randomuser.me/api/portraits/women/66.jpg',
      summary: {
        weight: '60 kg',
        hb: '10.8 g/dL',
        bp: '115/75 mmHg',
        risk: 'Low',
      },
      tips: ['tip_2_1', 'tip_2_2', 'tip_2_3'],
      notes: 'notes_2',
      family: [{ name: 'family_2_1_name', relation: 'family_2_1_relation', age: 33 }],
    },
    {
      id: '3',
      name: 'mother_3_name',
      age: '27',
      week: '28',
      lastVisit: '2025-05-25',
      nextVisit: '2025-06-20',
      img: 'https://randomuser.me/api/portraits/women/67.jpg',
      summary: {
        weight: '61 kg',
        hb: '11.0 g/dL',
        bp: '112/72 mmHg',
        risk: 'None',
      },
      tips: ['tip_3_1', 'tip_3_2'],
      notes: 'notes_3',
      family: [{ name: 'family_3_1_name', relation: 'family_3_1_relation', age: 35 }],
    },
  ];

  const families = [
    {
      id: "1",
      name: "family_1_name",
      mothers: ["1", "2"],
    },
    {
      id: "2",
      name: "family_2_name",
      mothers: ["3"],
    },
  ];

  const history: Mother[] = [
    {
      id: '4',
      name: 'history_4_name',
      age: '31',
      week: '16',
      lastVisit: '2025-05-10',
      nextVisit: '2025-06-05',
      img: 'https://randomuser.me/api/portraits/women/68.jpg',
      summary: {
        weight: '59 kg',
        hb: '12.0 g/dL',
        bp: '108/72 mmHg',
        risk: 'None',
      },
      tips: ['tip_4_1', 'tip_4_2'],
      notes: 'notes_4',
      family: [{ name: 'family_4_1_name', relation: 'family_4_1_relation', age: 34 }],
    },
    {
      id: '5',
      name: 'history_5_name',
      age: '28',
      week: '24',
      lastVisit: '2025-05-18',
      nextVisit: '2025-06-12',
      img: 'https://randomuser.me/api/portraits/women/69.jpg',
      summary: {
        weight: '62 kg',
        hb: '10.0 g/dL',
        bp: '100/70 mmHg',
        risk: 'Mild Anemia',
      },
      tips: ['tip_5_1', 'tip_5_2'],
      notes: 'notes_5',
      family: [{ name: 'family_5_1_name', relation: 'family_5_1_relation', age: 31 }],
    },
  ];

  const dynamicStyles = StyleSheet.create({
    profileCard: {
      alignItems: "center",
      marginRight: responsive.isLargeScreen
        ? 20
        : responsive.isTablet
        ? 18
        : 16,
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: responsive.isLargeScreen ? 16 : responsive.isTablet ? 14 : 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
      minWidth: responsive.cardWidth,
      maxWidth: responsive.cardMaxWidth,
    },
    avatar: {
      width: responsive.avatarSize,
      height: responsive.avatarSize,
      borderRadius: responsive.avatarSize / 2,
      marginBottom: 8,
    },
  });

  // Family Mode: Display mothers in the selected family
  if (familyId) {
    const family = families.find((f) => f.id === familyId);
    if (!family) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
          <Header />
          <View style={{ flex: 1, backgroundColor: "#e8f0ff", justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: "#333" }}>{translate('familyNotFound')}</Text>
          </View>
          <AppBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </SafeAreaView>
      );
    }

    const familyMothers = mothers.filter((m) => family.mothers.includes(m.id));

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
        <Header />
        <ScrollView style={{ flex: 1, backgroundColor: "#e8f0ff", padding: 16 }}>
          <Text style={styles.sectionTitle}>{translate(family.name)}</Text>
          <FlatList
            data={familyMothers}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={dynamicStyles.profileCard}
                onPress={() =>
                  router.push({
                    pathname: "/Aww/MotherProfile",
                    params: { name: translate(item.name) },
                  })
                }
              >
                <Image source={{ uri: item.img }} style={dynamicStyles.avatar} />
                <Text
                  style={[
                    styles.profileName,
                    {
                      fontSize: responsive.isLargeScreen
                        ? 17
                        : responsive.isTablet
                        ? 16
                        : 15,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {translate(item.name)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
        <AppBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </SafeAreaView>
    );
  }

  // Mother Mode: Display individual mother profile
  const allMothers = [...mothers, ...history];
  const mother = allMothers.find((m) => translate(m.name) === name);

  if (!mother) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
        <Header />
        <View style={{ flex: 1, backgroundColor: "#e8f0ff", justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: "#333" }}>{translate('motherNotFound')}</Text>
        </View>
        <AppBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
      <Header />
      <ScrollView style={{ flex: 1, backgroundColor: "#e8f0ff", padding: 16 }}>
        <View style={styles.header}>
          <Image source={{ uri: mother.img }} style={styles.avatar} />
          <Text style={styles.name}>{translate(mother.name)}</Text>
          <Text style={styles.subtitle}>
            {translate('age')}: {mother.age} | {translate('week')}: {mother.week}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate('visitInfo')}</Text>
          <Text style={styles.text}>{translate('lastVisit')}: {mother.lastVisit}</Text>
          <Text style={styles.text}>{translate('nextVisit')}: {mother.nextVisit}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate('summary')}</Text>
          <Text style={styles.text}>{translate('weight')}: {mother.summary.weight}</Text>
          <Text style={styles.text}>{translate('hb')}: {mother.summary.hb}</Text>
          <Text style={styles.text}>{translate('bp')}: {mother.summary.bp}</Text>
          <Text style={styles.text}>
            {translate('risk')}: {translate(`risk_${mother.summary.risk.replace(' ', '_').toLowerCase()}`)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate('counsellingTips')}</Text>
          {mother.tips.map((tip, index) => (
            <Text key={index} style={styles.bullet}>
              • {translate(tip)}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate('notes')}</Text>
          <Text style={styles.text}>{translate(mother.notes)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate('familyMembers')}</Text>
          {mother.family.map((member, index) => (
            <Text key={index} style={styles.text}>
              {translate(member.name)} - {translate(member.relation)} ({member.age} {translate('years')})
            </Text>
          ))}
        </View>
      </ScrollView>
      <AppBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#3a3a8a",
    marginBottom: 12,
    alignSelf: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3a3a8a",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3a3a8a",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  bullet: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#3a3a8a",
    marginBottom: 8,
    marginTop: 12,
    paddingHorizontal: 4,
    fontSize: 20,
  },
  profileName: {
    color: "#222",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
});