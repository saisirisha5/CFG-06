import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const clearAll = () => {
  // Clear all cookies
  if (typeof document !== 'undefined') {
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });
  }
  // Clear localStorage and sessionStorage
  if (typeof localStorage !== 'undefined') localStorage.clear();
  if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
};
const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.logoText}>Sample</Text>
       <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          clearAll();
          router.replace("/");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3a3a8a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  logoutBtn: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
    alignSelf: 'flex-end',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Header;
