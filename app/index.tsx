import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Modal, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Chatbot from "./chatbot";
import { useLanguage } from "./LanguageContext";

export default function Index() {
  const router = useRouter();
  const { language, setLanguage, translate, loading } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
    router.push("./Aww/home");
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3a3a8a" }}>
        <View style={styles.container}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.title1}>{translate('foundation')}</Text>
          <Text style={styles.title2}>{translate('motherChild')}</Text>
          <Text style={styles.title3}>{translate('india')}</Text>
          <TextInput
            placeholder={translate('username')}
            placeholderTextColor="#ccc"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder={translate('password')}
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#fff2",
              borderRadius: 24,
              paddingHorizontal: 20,
              height: 48,
              justifyContent: "center",
              marginBottom: 16,
              width: "100%",
            }}
            onPress={() => setModalVisible(true)}
            disabled={loading}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>{language}</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.dropdownModal}>
                {Object.keys(languageCodes).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      backgroundColor: language === lang ? "#3a3a8a" : "#fff",
                      borderRadius: 8,
                      marginBottom: 4,
                    }}
                    onPress={() => {
                      setLanguage(lang as keyof typeof languageCodes);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={{
                        color: language === lang ? "#fff" : "#3a3a8a",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          {loading && <ActivityIndicator color="#fff" style={{ marginBottom: 16 }} />}
          <TouchableOpacity style={styles.loginBtn} disabled={loading} onPress={handleLogin}>
            <Text style={styles.loginText}>{translate('login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgot}>{translate('forgot')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.supportedByContainer}>
          <Text style={styles.supportedByText}>{translate('supportedBy')}</Text>
          <Image source={require("../assets/images/logo.png")} style={styles.koitaLogo} />
        </View>
      </SafeAreaView>
      <Chatbot />
    </View>
  );
}

const languageCodes = {
  English: "en",
  Hindi: "hi",
  Marathi: "mr",
  Gujarati: "gu",
  Telugu: "te",
  Bengali: "bn",
  Tamil: "ta",
  Punjabi: "pa",
  Kannada: "kn",
  Malayalam: "ml"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: 16,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  title1: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 1,
    marginBottom: 0,
  },
  title2: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 0,
    marginTop: 2,
    textAlign: "center",
  },
  title3: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 1,
    marginBottom: 32,
    marginTop: 0,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff2",
    borderRadius: 24,
    paddingHorizontal: 20,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  loginBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "#3a3a8a99",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  forgot: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    textDecorationLine: "none",
  },
  supportedByContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  supportedByText: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 4,
  },
  koitaLogo: {
    width: 120,
    height: 32,
    resizeMode: "contain",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    elevation: 5,
  },
});