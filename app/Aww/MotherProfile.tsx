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

  const {
    name = "Asha Devi",
    age = "26",
    week = "32",
    lastVisit = "2025-06-01",
    nextVisit = "2025-06-30",
    profilePic = "https://randomuser.me/api/portraits/women/65.jpg",
    summary = '{"weight":"58 kg","hb":"11.5 g/dL","bp":"110/70 mmHg","risk":"None"}',
    tips = '["Eat iron-rich foods like spinach, lentils","Drink 2-3L water","Take iron & calcium supplements","Regular checkups"]',
    notes = "Mother is showing positive improvements. Fetal movement is normal. No signs of swelling or anemia.",
    family = '[{"name":"Ramu","relation":"Husband","age":30},{"name":"Maya","relation":"Mother-in-law","age":60},{"name":"Chintu","relation":"Elder Son","age":5}]'
  } = params;

  const parsedSummary: Summary = JSON.parse(summary as string);
  const parsedTips: string[] = JSON.parse(tips as string);
  const parsedFamily: FamilyMember[] = JSON.parse(family as string);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: profilePic as string }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>Age: {age} | Week: {week}</Text>
      </View>

      {/* Visit Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Visit Info</Text>
        <Text style={styles.text}>Last Visit: {lastVisit}</Text>
        <Text style={styles.text}>Next Visit: {nextVisit}</Text>
      </View>

      {/* Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Summary</Text>
        <Text style={styles.text}>Weight: {parsedSummary.weight}</Text>
        <Text style={styles.text}>Hemoglobin: {parsedSummary.hb}</Text>
        <Text style={styles.text}>Blood Pressure: {parsedSummary.bp}</Text>
        <Text style={styles.text}>Risk: {parsedSummary.risk}</Text>
      </View>

      {/* Tips */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Counselling Tips</Text>
        {parsedTips.map((tip, index) => (
          <Text key={index} style={styles.bullet}>• {tip}</Text>
        ))}
      </View>

      {/* Notes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notes</Text>
        <Text style={styles.text}>{notes}</Text>
      </View>

      {/* Family Members */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Family Members</Text>
        {parsedFamily.map((member, index) => (
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
    backgroundColor: "#e8f0ff", // soft blue background
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
  alignSelf: "center", // ✅ ensures image is centered
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
