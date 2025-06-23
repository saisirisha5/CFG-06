import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import Header from '../Header';
import AppBar from '../Appbar';

// Types
interface Location {
  type: string;
  coordinates: [number, number]; // [lng, lat]
}

interface UserProfile {
  location: Location;
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface JWTPayload {
  id: UserProfile;
  iat: number;
  exp: number;
}

interface AsyncStorageInterface {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

// JWT decoder
const jwtDecode = <T = any>(token: string): T => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const payload = parts[1];
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error('Failed to decode JWT: ' + (error as Error).message);
  }
};

// Cookie function for web
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

// Handle AsyncStorage
let AsyncStorage: AsyncStorageInterface | null = null;
if (Platform.OS !== 'web') {
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage');
  } catch {
    try {
      AsyncStorage = require('@react-native-community/async-storage');
    } catch {}
  }
}

// Get token from AsyncStorage or cookie
const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') return getCookie('authToken');
  if (!AsyncStorage) return null;
  try {
    return await AsyncStorage.getItem('authToken');
  } catch {
    return null;
  }
};

// Function to get location name from coordinates using BigDataCloud API
async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.city && data.countryName) {
      return `${data.city}, ${data.countryName}`;
    } else if (data.locality) {
      return data.locality;
    } else {
      return 'Unknown location';
    }
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'Error fetching location';
  }
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [locationName, setLocationName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        if (!token) return setError('No authentication token found');

        const decoded = jwtDecode<JWTPayload>(token);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          return setError('Token has expired');
        }

        if (decoded.id) setProfile(decoded.id);
        else setError('Invalid token format - no user data found');
      } catch (err) {
        setError('Failed to decode authentication token');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.location && profile.location.coordinates) {
      const [lon, lat] = profile.location.coordinates;
      getLocationName(lat, lon).then(name => setLocationName(name));
    } else {
      setLocationName('Location not available');
    }
  }, [profile]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>No profile data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.profileHeader}>
          {profile.profilePic ? (
            <Image source={{ uri: profile.profilePic }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholder]} />
          )}
            <Text style={styles.title}>{profile.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profile.email}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{locationName}</Text>
          </View>
        </View>
      </ScrollView>
      <AppBar activeTab="profile" setActiveTab={() => {}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  body: {
    padding: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholder: {
    backgroundColor: '#ccc'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000'
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoBlock: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666'
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 4
  },
  attribution: {
    fontSize: 10,
    color: '#666',
    marginTop: 20,
    textAlign: 'center'
  }
});

export default Profile;