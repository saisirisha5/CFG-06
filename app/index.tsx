import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Chatbot from "./chatbot";

const uiKeys = [
  "foundation",
  "motherChild",
  "india",
  "username",
  "password",
  "login",
  "forgot",
  "supportedBy"
];

const englishTexts = {
  foundation: "FOUNDATION FOR",
  motherChild: "MOTHER & CHILD HEALTH",
  india: "INDIA",
  username: "Username",
  password: "Password",
  login: "LOGIN",
  forgot: "Forgot Password?",
  supportedBy: "supported by:"
};

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

export default function Index() {
  const router = useRouter();
  const [language, setLanguage] = useState<keyof typeof languageCodes>("English");
  const [translations, setTranslations] = useState(englishTexts);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (language === "English") {
      setTranslations(englishTexts);
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchTranslations = async () => {
      const newTranslations: Partial<typeof englishTexts> = {};
      for (const key of uiKeys as (keyof typeof englishTexts)[]) {
        try {
          const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishTexts[key])}&langpair=en|${languageCodes[language]}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          newTranslations[key] = data.responseData.translatedText || englishTexts[key];
        } catch (error) {
          console.error(`Translation failed for ${key}:`, error);
          newTranslations[key] = englishTexts[key];
        }
      }
      setTranslations(newTranslations as typeof englishTexts);
      setLoading(false);
    };
    fetchTranslations();
  }, [language]);

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
    // Optionally add authentication logic here
    router.push("/Aww/home");
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3a3a8a" }}>
        <View style={styles.container}>
          {/* Logo */}
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          {/* Title */}
          <Text style={styles.title1}>{translations.foundation}</Text>
          <Text style={styles.title2}>{translations.motherChild}</Text>
          <Text style={styles.title3}>{translations.india}</Text>

          {/* Inputs */}
          <TextInput
            placeholder={translations.username}
            placeholderTextColor="#ccc"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder={translations.password}
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          {/* Language Dropdown */}
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
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
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
                      style={{ color: language === lang ? "#fff" : "#3a3a8a", fontWeight: "bold", fontSize: 16 }}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          {loading && <ActivityIndicator color="#fff" style={{ marginBottom: 16 }} />}
          {/* Login Button */}
          <TouchableOpacity style={styles.loginBtn} disabled={loading} onPress={handleLogin}>
            <Text style={styles.loginText}>{translations.login}</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity>
            <Text style={styles.forgot}>{translations.forgot}</Text>
          </TouchableOpacity>
        </View>
        {/* Supported by */}
        <View style={styles.supportedByContainer}>
          <Text style={styles.supportedByText}>{translations.supportedBy}</Text>
          <Image source={require("../assets/images/logo.png")} style={styles.koitaLogo} />
        </View>
      </SafeAreaView>
      <Chatbot />
    </View>
  );
}

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