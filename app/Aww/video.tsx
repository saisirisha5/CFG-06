import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../Header';
import Appbar from '../Appbar';
import { useLanguage } from '../LanguageContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Improved scaling functions with maximum limits
const scale = (size: number) => {
  const baseWidth = 320;
  const scaleFactor = screenWidth / baseWidth;
  // Limit scaling to prevent excessive growth on large screens
  const maxScale = 1.5;
  const limitedScale = Math.min(scaleFactor, maxScale);
  return size * limitedScale;
};

const verticalScale = (size: number) => {
  const baseHeight = 568;
  const scaleFactor = screenHeight / baseHeight;
  // Limit vertical scaling
  const maxScale = 1.4;
  const limitedScale = Math.min(scaleFactor, maxScale);
  return size * limitedScale;
};

const moderateScale = (size: number, factor = 0.5) => {
  const scaledSize = scale(size);
  return size + (scaledSize - size) * factor;
};

// Helper function to get responsive dimensions
const getResponsiveDimensions = () => {
  const isTablet = screenWidth >= 768;
  const isLargeScreen = screenWidth >= 1024;
  
  return {
    isTablet,
    isLargeScreen,
    containerMargin: isLargeScreen ? 16 : isTablet ? 12 : 8,
    videoHeight: isLargeScreen ? 250 : isTablet ? 220 : 200,
    playButtonSize: isLargeScreen ? 80 : isTablet ? 70 : 60,
    cardPadding: isLargeScreen ? 16 : isTablet ? 14 : 12,
  };
};

interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  uploadTime: string; // Date in "DD-MM-YYYY" format
  description: string;
}

function getTimeAgo(uploadDate: string): string {
  const [day, month, year] = uploadDate.split('-').map(Number);
  const upload = new Date(year, month - 1, day);
  const now = new Date();
  const diffMs = now.getTime() - upload.getTime();

  if (diffMs < 0) {
    return 'in the future';
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
}

const videoData: VideoItem[] = [
  {
    id: '1',
    title: 'Pregnancy Nutrition: Essential Foods for a Healthy Baby',
    videoId: 'dQw4w9WgXcQ',
    uploadTime: '20-06-2025',
    description: 'Learn about the most important nutrients needed during pregnancy for both mother and baby.',
  },
  {
    id: '2',
    title: 'Breastfeeding Tips for New Mothers',
    videoId: 'dQw4w9WgXcQ',
    uploadTime: '15-06-2025',
    description: 'Complete guide to successful breastfeeding techniques and common challenges.',
  },
];

const Video: React.FC = () => {
  const [activeTab, setActiveTab] = useState("video");
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  const flatListRef = useRef<FlatList<VideoItem>>(null);
  const { translate } = useLanguage();
  const responsive = getResponsiveDimensions();

  const handleVideoPress = useCallback((videoId: string) => {
    if (currentPlayingId === videoId) {
      setCurrentPlayingId(null);
    } else {
      setCurrentPlayingId(videoId);
    }
  }, [currentPlayingId]);

  const handleWebViewLoad = useCallback((videoId: string) => {
    setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
  }, []);

  const handleWebViewLoadStart = useCallback((videoId: string) => {
    setLoadingVideos(prev => ({ ...prev, [videoId]: true }));
  }, []);

  const handleWebViewError = useCallback((videoId: string) => {
    setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
    Alert.alert('Error', 'Failed to load video. Please check your internet connection.');
  }, []);

  const dynamicStyles = StyleSheet.create({
    listContent: {
      paddingTop: 16,
      paddingBottom: responsive.isLargeScreen ? 100 : responsive.isTablet ? 90 : 80,
    },
    videoContainer: {
      backgroundColor: '#fff',
      marginBottom: 12,
      borderRadius: 8,
      marginHorizontal: responsive.containerMargin,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    videoPlayerContainer: {
      height: responsive.videoHeight,
      backgroundColor: '#000',
      position: 'relative',
    },
    playButton: {
      width: responsive.playButtonSize,
      height: responsive.playButtonSize,
      borderRadius: responsive.playButtonSize / 2,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    playButtonText: {
      fontSize: responsive.isLargeScreen ? 32 : responsive.isTablet ? 28 : 24,
      color: '#3a3a8a',
      marginLeft: responsive.isLargeScreen ? 4 : 3,
    },
    videoInfo: {
      padding: responsive.cardPadding,
    },
  });

  const renderVideoItem = useCallback(({ item }: { item: VideoItem }) => {
    const isPlaying = currentPlayingId === item.id;
    const isLoading = loadingVideos[item.id];

    return (
      <View style={dynamicStyles.videoContainer}>
        <View style={dynamicStyles.videoPlayerContainer}>
          {isPlaying ? (
            <View style={styles.webViewContainer}>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3a3a8a" />
                  <Text style={[
                    styles.loadingText,
                    { fontSize: responsive.isLargeScreen ? 16 : responsive.isTablet ? 15 : 14 }
                  ]}>
                    Loading video...
                  </Text>
                </View>
              )}
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${item.videoId}?autoplay=1&controls=1&showinfo=0&rel=0`,
                }}
                style={styles.webView}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                onLoadStart={() => handleWebViewLoadStart(item.id)}
                onLoad={() => handleWebViewLoad(item.id)}
                onError={() => handleWebViewError(item.id)}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.thumbnailContainer}
              onPress={() => handleVideoPress(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.thumbnail}>
                <View style={styles.playButtonContainer}>
                  <View style={dynamicStyles.playButton}>
                    <Text style={dynamicStyles.playButtonText}>▶</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={dynamicStyles.videoInfo}>
          <Text style={[
            styles.videoTitle,
            { 
              fontSize: responsive.isLargeScreen ? 18 : responsive.isTablet ? 17 : 16,
              lineHeight: responsive.isLargeScreen ? 24 : responsive.isTablet ? 23 : 22
            }
          ]} numberOfLines={2}>
            {translate(`video_${item.id}_title`)}
          </Text>
          <Text style={[
            styles.uploadTime,
            { fontSize: responsive.isLargeScreen ? 13 : responsive.isTablet ? 12.5 : 12 }
          ]}>
            {getTimeAgo(item.uploadTime)}
          </Text>
          <Text style={[
            styles.videoDescription,
            { 
              fontSize: responsive.isLargeScreen ? 14 : responsive.isTablet ? 13.5 : 13,
              lineHeight: responsive.isLargeScreen ? 20 : responsive.isTablet ? 19 : 18
            }
          ]} numberOfLines={2}>
            {translate(`video_${item.id}_desc`)}
          </Text>
        </View>
      </View>
    );
  }, [currentPlayingId, loadingVideos, handleVideoPress, handleWebViewLoad, handleWebViewLoadStart, handleWebViewError, translate, responsive, dynamicStyles]);

  const keyExtractor = useCallback((item: VideoItem) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3a3a8a" />
      <Header />
      <View style={styles.body}>
        <FlatList
          ref={flatListRef}
          data={videoData}
          renderItem={renderVideoItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: responsive.isLargeScreen ? 100 : responsive.isTablet ? 90 : 80 }
          ]}
          onScrollBeginDrag={() => {
            if (currentPlayingId) {
              setCurrentPlayingId(null);
            }
          }}
        />
      </View>
      <Appbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a3a8a',
  },
  body: {
    flex: 1,
    backgroundColor: '#f7f7fa',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
  },
  thumbnailContainer: {
    flex: 1,
  },
  thumbnail: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  uploadTime: {
    color: '#666',
    marginBottom: 4,
  },
  videoDescription: {
    color: '#555',
  },
});

export default Video;