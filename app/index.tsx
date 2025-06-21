import React, { useState } from "react";
import { Image, Picker, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [language, setLanguage] = useState("English");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3a3a8a' }}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        {/* Title */}
        <Text style={styles.title1}>FOUNDATION FOR</Text>
        <Text style={styles.title2}>MOTHER & CHILD HEALTH</Text>
        <Text style={styles.title3}>INDIA</Text>

        {/* Inputs */}
        <TextInput placeholder="Username" placeholderTextColor="#ccc" style={styles.input} />
        <TextInput placeholder="password" placeholderTextColor="#ccc" secureTextEntry style={styles.input} />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="English" value="English" color="#222" />
            <Picker.Item label="Hindi" value="Hindi" color="#222" />
            <Picker.Item label="Marathi" value="Marathi" color="#222" />
            <Picker.Item label="Gujarati" value="Gujarati" color="#222" />
          </Picker>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      {/* Supported by */}
      <View style={styles.supportedByContainer}>
        <Text style={styles.supportedByText}>supported by:</Text>
        <Image source={require("../assets/images/logo.png")} style={styles.koitaLogo} />
      </View>
    </SafeAreaView>
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
    marginTop: Platform.OS === 'android' ? 40 : 0,
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
    textAlign: 'center',
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
  pickerWrapper: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff2",
    borderRadius: 24,
    marginBottom: 16,
    justifyContent: 'center',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#fff2',
    borderRadius: 24,
    width: '100%',
    height: 48,
    marginLeft: 0,
    paddingHorizontal: 20,
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
    shadowColor: '#000',
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
    textAlign: 'center',
    textDecorationLine: 'none',
  },
  supportedByContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  supportedByText: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 4,
  },
  koitaLogo: {
    width: 120,
    height: 32,
    resizeMode: 'contain',
  },
});
