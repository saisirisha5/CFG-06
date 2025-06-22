import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useRef } from "react";
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
  Modal,
  Alert,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
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
  translationKey?: string;
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
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const responsive = getResponsiveDimensions();
  const router = useRouter();

  const mothers: Mother[] = [
    {
      id: '1',
      name: 'Asha Devi',
      translationKey: 'family_1_name',
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
      translationKey: 'family_2_name',
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
      tips: [
        'Maintain regular sleep schedule',
        'Moderate walking',
      ],
      notes: 'Healthy and active. Monitoring closely.',
      family: [{ name: 'Vinod', relation: 'Husband', age: 35 }],
    },
  ];

  const families = [
    {
      id: "1",
      name: "Devi Family",
      mothers: ["1", "2"],
    },
    {
      id: "2",
      name: "Singh Family",
      mothers: ["3"],
    },
  ];

  const history: Mother[] = [
    {
      id: '4',
      name: 'Radha Patel',
      translationKey: 'history_4_name',
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
      tips: [
        'Continue prenatal vitamins',
        'Gentle walking daily',
      ],
      notes: 'Doing well. Reports better appetite and energy.',
      family: [{ name: 'Ravi', relation: 'Husband', age: 34 }],
    },
    {
      id: '5',
      name: 'Kavita Joshi',
      translationKey: 'history_5_name',
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
      tips: [
        'Increase iron intake',
        'Regular blood checks',
      ],
      notes: 'Mild anemia detected. Iron supplements recommended.',
      family: [{ name: 'Raj', relation: 'Husband', age: 31 }],
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

  // Camera functions
  const requestPermissions = async () => {
    if (!permission) {
      const cameraResult = await requestPermission();
      if (!cameraResult.granted) {
        Alert.alert('Permission Required', 'Camera permission is required for attendance.');
        return false;
      }
    }

    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (permission?.granted && locationStatus === 'granted') {
      return true;
    } else {
      Alert.alert('Permission Required', 'Camera and location permissions are required for attendance.');
      return false;
    }
  };

  const handleUploadAttendance = async () => {
    const hasPermissions = await requestPermissions();
    if (hasPermissions) {
      setCameraVisible(true);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        // Take picture
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        // Log the data
        console.log('📸 Attendance Photo Captured:');
        console.log('📍 Location:', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toISOString(),
        });
        console.log('🖼️ Photo URI:', photo.uri);
        console.log('📊 Photo Info:', {
          width: photo.width,
          height: photo.height,
          base64Length: photo.base64?.length || 0,
        });

        // Close camera
        setCameraVisible(false);
        
        // Show success message
        Alert.alert(
          '✅ Attendance Uploaded!', 
          `Photo captured successfully!\n📍 Location: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}\n⏰ Time: ${new Date().toLocaleString()}\n\nAttendance has been recorded.`
        );

        // Here you can add your upload logic to server
        // uploadAttendanceToServer(photo, location);

      } catch (error) {
        console.error('Error taking picture or getting location:', error);
        Alert.alert('❌ Error', 'Failed to capture attendance. Please try again.');
      }
    }
  };

  // Family Mode: Display mothers in the selected family
  if (familyId) {
    const family = families.find((f) => f.id === familyId);
    if (!family) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
          <Header />
          <View style={{ flex: 1, backgroundColor: "#e8f0ff", justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: "#333" }}>{translate("Family not found.")}</Text>
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
                    params: { name: translate(item.translationKey || item.name) },
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
                  {translate(item.translationKey || item.name)}
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
  
  const mother = allMothers.find((m) => {
    const translatedName = translate(m.translationKey || m.name);
    return translatedName === name || m.name === name;
  });

  if (!mother) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
        <Header />
        <View style={{ flex: 1, backgroundColor: "#e8f0ff", justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: "#333" }}>{translate("Mother profile not found.")}</Text>
        </View>
        <AppBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </SafeAreaView>
    );
  }

  // MCQ data
  const mcqQuestions = [
    {
      id: 1,
      question: "Is she taking proper diet?",
      options: ["Yes, regularly", "Sometimes", "No", "Not sure"],
    },
    {
      id: 2,
      question: "Is she taking iron tablets daily?",
      options: ["Yes, daily", "Sometimes", "No", "Stopped taking"],
    },
    {
      id: 3,
      question: "Does she have any swelling in feet/hands?",
      options: ["No swelling", "Mild swelling", "Moderate swelling", "Severe swelling"],
    },
    {
      id: 4,
      question: "How is her sleep pattern?",
      options: ["Good (7-8 hours)", "Fair (5-6 hours)", "Poor (less than 5 hours)", "Disturbed"],
    },
    {
      id: 5,
      question: "Any unusual symptoms or complaints?",
      options: ["None", "Mild discomfort", "Moderate issues", "Severe problems"],
    },
  ];

  const [mcqAnswers, setMcqAnswers] = useState<{[key: number]: number}>({});

  const handleMcqAnswer = (questionId: number, optionIndex: number) => {
    setMcqAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
      <Header />
      <ScrollView 
        style={{ flex: 1, backgroundColor: "#e8f0ff", padding: 16 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: mother.img }} style={styles.avatar} />
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadAttendance}>
              <Text style={styles.uploadButtonText}>📸 {translate("Take Attendance")}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{translate(mother.translationKey || mother.name)}</Text>
          <Text style={styles.subtitle}>
            {translate("Age")}: {mother.age} | {translate("Week")}: {mother.week}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate("Visit Info")}</Text>
          <Text style={styles.text}>{translate("Last Visit")}: {mother.lastVisit}</Text>
          <Text style={styles.text}>{translate("Next Visit")}: {mother.nextVisit}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate("Summary")}</Text>
          <Text style={styles.text}>{translate("Weight")}: {mother.summary.weight}</Text>
          <Text style={styles.text}>{translate("Hemoglobin")}: {mother.summary.hb}</Text>
          <Text style={styles.text}>{translate("Blood Pressure")}: {mother.summary.bp}</Text>
          <Text style={styles.text}>
            {translate("Risk")}: {translate(mother.summary.risk)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate("Counselling Tips")}</Text>
          {mother.tips.map((tip, index) => (
            <Text key={index} style={styles.bullet}>
              • {translate(tip)}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate("Notes")}</Text>
          <Text style={styles.text}>{translate(mother.notes)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translate("Family Members")}</Text>
          {mother.family.map((member, index) => (
            <Text key={index} style={styles.text}>
              {translate(member.name)} - {translate(member.relation)} ({member.age} {translate("yrs")})
            </Text>
          ))}
        </View>

        <View style={[styles.card, { marginBottom: 24 }]}>
          <Text style={styles.cardTitle}>{translate("Health Assessment")}</Text>
          {mcqQuestions.map((question) => (
            <View key={question.id} style={styles.mcqContainer}>
              <Text style={styles.mcqQuestion}>{translate(question.question)}</Text>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.mcqOption,
                    mcqAnswers[question.id] === index && styles.mcqOptionSelected
                  ]}
                  onPress={() => handleMcqAnswer(question.id, index)}
                >
                  <View style={[
                    styles.radioButton,
                    mcqAnswers[question.id] === index && styles.radioButtonSelected
                  ]} />
                  <Text style={[
                    styles.mcqOptionText,
                    mcqAnswers[question.id] === index && styles.mcqOptionTextSelected
                  ]}>
                    {translate(option)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>{translate("Submit Assessment")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Camera Modal */}
      <Modal
        visible={cameraVisible}
        animationType="slide"
        onRequestClose={() => setCameraVisible(false)}
      >
        <View style={styles.cameraContainer}>
          {!permission ? (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.permissionText}>Requesting camera permissions...</Text>
            </View>
          ) : !permission.granted ? (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.permissionText}>Camera permission required</Text>
              <TouchableOpacity 
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setCameraVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={cameraType}
              />
              
              {/* Camera Controls */}
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.cameraControlButton}
                  onPress={() => setCameraVisible(false)}
                >
                  <Text style={styles.cameraControlText}>✕</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.cameraControlButton}
                  onPress={toggleCameraType}
                >
                  <Text style={styles.cameraControlText}>🔄</Text>
                </TouchableOpacity>
              </View>
              
              {/* Attendance Info Overlay */}
              <View style={styles.attendanceInfo}>
                <Text style={styles.attendanceInfoText}>📍 Capturing attendance with location</Text>
                <Text style={styles.attendanceInfoSubText}>Make sure you're at the visit location</Text>
              </View>
            </>
          )}
        </View>
      </Modal>

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
  profileImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#3a3a8a",
    alignSelf: "center",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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
  // MCQ Styles
  mcqContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  mcqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    lineHeight: 22,
  },
  mcqOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  mcqOptionSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#3a3a8a",
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  radioButtonSelected: {
    borderColor: "#3a3a8a",
    backgroundColor: "#3a3a8a",
  },
  mcqOptionText: {
    fontSize: 15,
    color: "#555",
    flex: 1,
  },
  mcqOptionTextSelected: {
    color: "#3a3a8a",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraControlText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  closeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  attendanceInfoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  attendanceInfoSubText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
});