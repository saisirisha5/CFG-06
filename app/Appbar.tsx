import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type AppBarProps = {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
};

const AppBar: React.FC<AppBarProps> = ({ activeTab = "home", setActiveTab }) => {
  const router = useRouter();

  const handleTabPress = (tab: string) => {
    // If setActiveTab is provided, use it (for local state management)
    if (setActiveTab) {
      setActiveTab(tab);
    }
    
    // Navigate using expo-router
    switch (tab) {
      case "home":
        router.push("/Aww/home");
        break;
      case "video":
        router.push("/Aww/video");
        break;
      case "profile":
        router.push("/Aww/profile"); // You'll need to create this screen
        break;
      default:
        router.push("/");
    }
  };

  return (
    <View style={styles.appBar}>
      <TouchableOpacity onPress={() => handleTabPress("home")} style={styles.tab}>
        <Text style={[styles.icon, activeTab === "home" && styles.activeIcon]}>🏠</Text>
        <Text style={styles.tabLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress("video")} style={styles.tab}>
        <Text style={[styles.icon, activeTab === "video" && styles.activeIcon]}>🎥</Text>
        <Text style={styles.tabLabel}>Video</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTabPress("profile")} style={styles.tab}>
        <Text style={[styles.icon, activeTab === "profile" && styles.activeIcon]}>👤</Text>
        <Text style={styles.tabLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#3a3a8a",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
    color: "#ccc",
  },
  activeIcon: {
    color: "#fff",
  },
  tabLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
});

export default AppBar;