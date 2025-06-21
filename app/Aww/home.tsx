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
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../Header";
import AppBar from "../Appbar";
import { useLanguage } from "../LanguageContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Scaling functions
const scale = (size: number) => {
  const baseWidth = 320;
  const scaleFactor = screenWidth / baseWidth;
  const maxScale = 1.5;
  return size * Math.min(scaleFactor, maxScale);
};

const verticalScale = (size: number) => {
  const baseHeight = 568;
  const scaleFactor = screenHeight / baseHeight;
  const maxScale = 1.4;
  return size * Math.min(scaleFactor, maxScale);
};

const moderateScale = (size: number, factor = 0.5) => {
  const scaledSize = scale(size);
  return size + (scaledSize - size) * factor;
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
    resourceImageSize: isLargeScreen ? 80 : isTablet ? 70 : 60,
  };
};

const getStatusBarHeight = () => {
  return Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
};

const families = [
  {
    id: "1",
    name: "family_1_name",
    img: "https://images.unsplash.com/photo-1524502391471-f0101353c86d?auto=format&fit=crop&w=400&q=80",
    mothers: ["1", "2"], // Mother IDs from mothers array
  },
  {
    id: "2",
    name: "family_2_name",
    img: "https://images.unsplash.com/photo-1516321318423-6d56e749c5bc?auto=format&fit=crop&w=400&q=80",
    mothers: ["3"],
  },
];

const history = [
  {
    id: "4",
    name: "history_4_name",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "5",
    name: "history_5_name",
    img: "https://randomuser.me/api/portraits/women/69.jpg",
  },
];

const resources = [
  {
    id: "1",
    title: "resource_1_title",
    desc: "resource_1_desc",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    title: "resource_2_title",
    desc: "resource_2_desc",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    title: "resource_3_title",
    desc: "resource_3_desc",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const { translate } = useLanguage();
  const responsive = getResponsiveDimensions();
  const router = useRouter();

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
    resourceImg: {
      width: responsive.resourceImageSize,
      height: responsive.resourceImageSize,
      borderRadius: 8,
      marginRight: responsive.isLargeScreen
        ? 16
        : responsive.isTablet
        ? 14
        : 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3a3a8a" />
      <Header />
      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: responsive.containerPadding },
          ]}
        >
          {/* Assigned Families */}
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: responsive.isLargeScreen
                  ? 22
                  : responsive.isTablet
                  ? 20
                  : 18,
              },
            ]}
          >
            {translate("assignedFamilies")}
          </Text>
          <FlatList
            data={families}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
            contentContainerStyle={styles.horizontalListContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={dynamicStyles.profileCard}
                onPress={() =>
                  router.push({
                    pathname: "/Aww/MotherProfile",
                    params: { familyId: item.id },
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

          {/* History */}
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: responsive.isLargeScreen
                  ? 22
                  : responsive.isTablet
                  ? 20
                  : 18,
              },
            ]}
          >
            {translate("history")}
          </Text>
          <FlatList
            data={history}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalList}
            contentContainerStyle={styles.horizontalListContent}
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

          {/* Resources */}
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: responsive.isLargeScreen
                  ? 22
                  : responsive.isTablet
                  ? 20
                  : 18,
              },
            ]}
          >
            {translate("resources")}
          </Text>
          <View style={styles.resourcesContainer}>
            {resources.map((resource) => (
              <TouchableOpacity
                key={resource.id}
                style={[
                  styles.resourceCard,
                  {
                    padding: responsive.isLargeScreen
                      ? 16
                      : responsive.isTablet
                      ? 14
                      : 12,
                    minHeight: responsive.isLargeScreen
                      ? 100
                      : responsive.isTablet
                      ? 90
                      : 80,
                  },
                ]}
              >
                <Image
                  source={{ uri: resource.img }}
                  style={dynamicStyles.resourceImg}
                />
                <View style={styles.resourceContent}>
                  <Text
                    style={[
                      styles.resourceTitle,
                      {
                        fontSize: responsive.isLargeScreen
                          ? 18
                          : responsive.isTablet
                          ? 17
                          : 16,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {translate(resource.title)}
                  </Text>
                  <Text
                    style={[
                      styles.resourceDesc,
                      {
                        fontSize: responsive.isLargeScreen
                          ? 15
                          : responsive.isTablet
                          ? 14.5
                          : 14,
                      },
                    ]}
                    numberOfLines={3}
                  >
                    {translate(resource.desc)}
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
    backgroundColor: "#3a3a8a",
  },
  body: {
    flex: 1,
    backgroundColor: "#f7f7fa",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: verticalScale(80),
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#3a3a8a",
    marginBottom: 8,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  horizontalList: {
    marginBottom: 16,
  },
  horizontalListContent: {
    paddingHorizontal: 4,
  },
  profileName: {
    color: "#222",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
  resourcesContainer: {
    paddingHorizontal: 4,
  },
  resourceCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  resourceContent: {
    flex: 1,
    justifyContent: "center",
  },
  resourceTitle: {
    fontWeight: "bold",
    color: "#3a3a8a",
    marginBottom: 4,
    lineHeight: 20,
  },
  resourceDesc: {
    color: "#444",
    lineHeight: 18,
  },
});