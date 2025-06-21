import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

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

export default function MotherProfile() {
  const params = useLocalSearchParams();
  const { name } = params;

  const mothers = [
    {
      id: '1',
      name: 'Asha Devi',
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
      tips: [
        'Eat iron-rich foods like spinach, lentils',
        'Drink 2-3L water',
        'Take iron & calcium supplements',
        'Regular checkups',
      ],
      notes: 'Mother is showing positive improvements. Fetal movement is normal. No signs of swelling or anemia.',
      family: [
        { name: 'Ramu', relation: 'Husband', age: 30 },
        { name: 'Maya', relation: 'Mother-in-law', age: 60 },
        { name: 'Chintu', relation: 'Elder Son', age: 5 },
      ],
    },
    {
      id: '2',
      name: 'Sunita Kumari',
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
      tips: [
        'Avoid heavy lifting',
        'Get enough sleep',
        'Eat fruits and vegetables',
      ],
      notes: 'Needs more rest and better diet. Slight fatigue reported.',
      family: [{ name: 'Suresh', relation: 'Husband', age: 33 }],
    },
    {
      id: '3',
      name: 'Meena Singh',
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
      tips: ['Maintain regular sleep schedule', 'Moderate walking'],
      notes: 'Healthy and active. Monitoring closely.',
      family: [{ name: 'Vinod', relation: 'Husband', age: 35 }],
    },
  ];

  const history = [
    {
      id: '4',
      name: 'Radha Patel',
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
      tips: ['Continue prenatal vitamins', 'Gentle walking daily'],
      notes: 'Doing well. Reports better appetite and energy.',
      family: [{ name: 'Ravi', relation: 'Husband', age: 34 }],
    },
    {
      id: '5',
      name: 'Kavita Joshi',
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
      tips: ['Increase iron intake', 'Regular blood checks'],
      notes: 'Mild anemia detected. Iron supplements recommended.',
      family: [{ name: 'Raj', relation: 'Husband', age: 31 }],
    },
  ];

  const allMothers = [...mothers, ...history];
  const mother = allMothers.find((m) => m.name === name);

  if (!mother) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Mother profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: mother.img }} style={styles.avatar} />
        <Text style={styles.name}>{mother.name}</Text>
        <Text style={styles.subtitle}>
          Age: {mother.age} | Week: {mother.week}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Visit Info</Text>
        <Text style={styles.text}>Last Visit: {mother.lastVisit}</Text>
        <Text style={styles.text}>Next Visit: {mother.nextVisit}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Summary</Text>
        <Text style={styles.text}>Weight: {mother.summary.weight}</Text>
        <Text style={styles.text}>Hemoglobin: {mother.summary.hb}</Text>
        <Text style={styles.text}>Blood Pressure: {mother.summary.bp}</Text>
        <Text style={styles.text}>Risk: {mother.summary.risk}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Counselling Tips</Text>
        {mother.tips.map((tip, index) => (
          <Text key={index} style={styles.bullet}>
            • {tip}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notes</Text>
        <Text style={styles.text}>{mother.notes}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Family Members</Text>
        {mother.family.map((member, index) => (
          <Text key={index} style={styles.text}>
            {member.name} - {member.relation} ({member.age} yrs)
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f0ff",
    padding: 16,
  },
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
});
