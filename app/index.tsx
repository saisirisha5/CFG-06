import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { 
  ActivityIndicator, 
  Image, 
  Modal, 
  Platform, 
  Alert, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chatbot from "./chatbot";
import { useLanguage, languageCodes } from "./LanguageContext";

const AUTH_TOKEN_KEY = 'authToken';

export default function Index() {
  const router = useRouter();
  const { language, setLanguage, translate, loading: languageLoading } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          // User is already logged in, redirect to home
          router.push("./Aww/home");
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        translate('validationError'), 
        translate('enterEmailPassword')
      );
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/counsellor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save auth token
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
         if (typeof document !== "undefined") {
    const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // 1 hour expiry
    document.cookie = `authToken=${data.token}; expires=${expires}; path=/;`;
  }
        console.log(translate('loginSuccessful'), data);
        
        // Navigate to home screen
        router.push("./Aww/home");
      } else {
        Alert.alert(
          translate('loginFailed'), 
          data.message || translate('invalidCredentials')
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert(
        translate('networkError'), 
        translate('connectionError')
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLanguageSelect = (selectedLang: keyof typeof languageCodes) => {
    setLanguage(selectedLang);
    setModalVisible(false);
  };

  if (languageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3a3a8a" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#3a3a8a" }}>
        <View style={styles.container}>
          <Image 
            source={require("../assets/images/logo.png")} 
            style={styles.logo} 
          />
          <Text style={styles.title1}>{translate('foundation')}</Text>
          <Text style={styles.title2}>{translate('motherChild')}</Text>
          <Text style={styles.title3}>{translate('india')}</Text>
          
          <TextInput
            placeholder={translate('email')}
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            placeholder={translate('password')}
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          {/* Language Selector */}
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => setModalVisible(true)}
            disabled={languageLoading}
          >
            <Text style={styles.languageSelectorText}>
              {language} {languageLoading ? '...' : ''}
            </Text>
          </TouchableOpacity>
          
          {/* Language Selection Modal */}
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
                <Text style={styles.modalTitle}>Select Language</Text>
                {Object.keys(languageCodes).map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.languageOption,
                      { backgroundColor: language === lang ? "#3a3a8a" : "#fff" }
                    ]}
                    onPress={() => handleLanguageSelect(lang as keyof typeof languageCodes)}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        { color: language === lang ? "#fff" : "#3a3a8a" }
                      ]}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          
          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginBtn, loginLoading && styles.loginBtnDisabled]} 
            disabled={loginLoading || languageLoading} 
            onPress={handleLogin}
          >
            {loginLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginText}>{translate('login')}</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.forgot}>{translate('forgot')}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.supportedByContainer}>
          <Text style={styles.supportedByText}>{translate('supportedBy')}</Text>
          <Image 
            source={require("../assets/images/logo.png")} 
            style={styles.koitaLogo} 
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3a3a8a',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
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
  languageSelector: {
    backgroundColor: "#fff2",
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 48,
    justifyContent: "center",
    marginBottom: 16,
    width: "100%",
  },
  languageSelectorText: {
    color: "#fff",
    fontSize: 16,
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
  loginBtnDisabled: {
    opacity: 0.6,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    minWidth: 250,
    maxHeight: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a3a8a',
    textAlign: 'center',
    marginBottom: 16,
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  languageOptionText: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: 'center',
  },
});