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
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../Header';
import Appbar from '../Appbar';
import { useLanguage } from '../LanguageContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scale = (size: number) => (screenWidth / 320) * size;
const verticalScale = (size: number) => (screenHeight / 568) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  duration: string;
  views: string;
  uploadTime: string;
  channel: string;
  description: string;
}

const videoData: VideoItem[] = [
  {
    id: '1',
    title: 'Pregnancy Nutrition: Essential Foods for a Healthy Baby',
    videoId: 'dQw4w9WgXcQ',
    duration: '12:34',
    views: '2.3M',
    uploadTime: '2 days ago',
    channel: 'Health First',
    description: 'Learn about the most important nutrients needed during pregnancy for both mother and baby.',
  },
  {
    id: '2',
    title: 'Breastfeeding Tips for New Mothers',
    videoId: 'dQw4w9WgXcQ',
    duration: '15:22',
    views: '1.8M',
    uploadTime: '1 week ago',
    channel: 'Mom Care Guide',
    description: 'Complete guide to successful breastfeeding techniques and common challenges.',
  },
  {
    id: '3',
    title: 'Child Vaccination Schedule Explained',
    videoId: 'dQw4w9WgXcQ',
    duration: '10:45',
    views: '956K',
    uploadTime: '3 days ago',
    channel: 'Pediatric Health',
    description: 'Understanding the importance and timing of childhood vaccinations.',
  },
  {
    id: '4',
    title: 'Prenatal Yoga for Expecting Mothers',
    videoId: 'dQw4w9WgXcQ',
    duration: '18:30',
    views: '1.2M',
    uploadTime: '5 days ago',
    channel: 'Wellness Journey',
    description: 'Safe and effective yoga exercises for pregnant women.',
  },
  {
    id: '5',
    title: 'Postpartum Mental Health: What to Expect',
    videoId: 'dQw4w9WgXcQ',
    duration: '14:17',
    views: '743K',
    uploadTime: '1 day ago',
    channel: 'Mental Health Matters',
    description: 'Understanding postpartum depression and anxiety, with coping strategies.',
  },
  {
    id: '6',
    title: 'Baby Sleep Training Methods',
    videoId: 'dQw4w9WgXcQ',
    duration: '20:15',
    views: '2.1M',
    uploadTime: '1 week ago',
    channel: 'Sleep Solutions',
    description: 'Gentle and effective methods to help your baby sleep through the night.',
  },
  {
    id: '7',
    title: 'First Aid for Infants and Toddlers',
    videoId: 'dQw4w9WgXcQ',
    duration: '16:42',
    views: '1.5M',
    uploadTime: '4 days ago',
    channel: 'Safety First',
    description: 'Essential first aid skills every parent should know for emergencies.',
  },
  {
    id: '8',
    title: 'Introducing Solid Foods to Your Baby',
    videoId: 'dQw4w9WgXcQ',
    duration: '13:28',
    views: '1.9M',
    uploadTime: '6 days ago',
    channel: 'Baby Nutrition',
    description: 'Step-by-step guide to starting your baby on solid foods safely.',
  },
  {
    id: '9',
    title: 'Managing Morning Sickness During Pregnancy',
    videoId: 'dQw4w9WgXcQ',
    duration: '11:55',
    views: '867K',
    uploadTime: '2 days ago',
    channel: 'Pregnancy Care',
    description: 'Natural remedies and tips to cope with morning sickness effectively.',
  },
  {
    id: '10',
    title: 'Child Development Milestones: 0-12 Months',
    videoId: 'dQw4w9WgXcQ',
    duration: '22:10',
    views: '1.3M',
    uploadTime: '1 week ago',
    channel: 'Child Development',
    description: 'Understanding your baby\'s growth and development in the first year.',
  },
  {
    id: '11',
    title: 'Maternity Exercise: Safe Workouts During Pregnancy',
    videoId: 'dQw4w9WgXcQ',
    duration: '17:33',
    views: '1.1M',
    uploadTime: '3 days ago',
    channel: 'Fit Pregnancy',
    description: 'Safe and beneficial exercises for each trimester of pregnancy.',
  },
  {
    id: '12',
    title: 'Creating a Safe Nursery Environment',
    videoId: 'dQw4w9WgXcQ',
    duration: '14:20',
    views: '692K',
    uploadTime: '5 days ago',
    channel: 'Home Safety',
    description: 'Essential tips for baby-proofing and creating a safe nursery space.',
  },
  {
    id: '13',
    title: 'Understanding Baby Cries and Communication',
    videoId: 'dQw4w9WgXcQ',
    duration: '12:07',
    views: '1.4M',
    uploadTime: '2 days ago',
    channel: 'Baby Communication',
    description: 'Learn to decode your baby\'s different cries and early communication signals.',
  },
  {
    id: '14',
    title: 'Maternal Health: Warning Signs to Watch For',
    videoId: 'dQw4w9WgXcQ',
    duration: '19:45',
    views: '923K',
    uploadTime: '4 days ago',
    channel: 'Women\'s Health',
    description: 'Important health warning signs during pregnancy and postpartum period.',
  },
  {
    id: '15',
    title: 'Building Strong Mother-Child Bond',
    videoId: 'dQw4w9WgXcQ',
    duration: '16:18',
    views: '1.6M',
    uploadTime: '1 week ago',
    channel: 'Parenting Connection',
    description: 'Activities and practices to strengthen the emotional bond with your child.',
  },
  {
    id: '16',
    title: 'Dealing with Colic in Newborns',
    videoId: 'dQw4w9WgXcQ',
    duration: '13:52',
    views: '758K',
    uploadTime: '3 days ago',
    channel: 'Newborn Care',
    description: 'Understanding and managing colic symptoms in newborn babies.',
  },
  {
    id: '17',
    title: 'Preparing for Labor and Delivery',
    videoId: 'dQw4w9WgXcQ',
    duration: '25:30',
    views: '2.4M',
    uploadTime: '6 days ago',
    channel: 'Birth Preparation',
    description: 'Complete guide to preparing mentally and physically for childbirth.',
  },
  {
    id: '18',
    title: 'Postpartum Recovery: What No One Tells You',
    videoId: 'dQw4w9WgXcQ',
    duration: '18:15',
    views: '1.7M',
    uploadTime: '2 days ago',
    channel: 'Recovery Guide',
    description: 'Honest discussion about postpartum recovery and self-care tips.',
  },
  {
    id: '19',
    title: 'Childproofing Your Home: Complete Checklist',
    videoId: 'dQw4w9WgXcQ',
    duration: '21:40',
    views: '1.2M',
    uploadTime: '1 week ago',
    channel: 'Safety Experts',
    description: 'Room-by-room guide to making your home safe for toddlers.',
  },
  {
    id: '20',
    title: 'Supporting Partners During Pregnancy',
    videoId: 'dQw4w9WgXcQ',
    duration: '15:05',
    views: '834K',
    uploadTime: '4 days ago',
    channel: 'Partner Support',
    description: 'How partners can provide emotional and practical support during pregnancy.',
  },
];

const Video: React.FC = () => {
  const [activeTab, setActiveTab] = useState("video");
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  const flatListRef = useRef<FlatList<VideoItem>>(null);
  const { translate } = useLanguage();

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

  const renderVideoItem = useCallback(({ item, index }: { item: VideoItem; index: number }) => {
    const isPlaying = currentPlayingId === item.id;
    const isLoading = loadingVideos[item.id];

    return (
      <View style={styles.videoContainer}>
        <View style={styles.videoPlayerContainer}>
          {isPlaying ? (
            <View style={styles.webViewContainer}>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3a3a8a" />
                  <Text style={styles.loadingText}>Loading video...</Text>
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
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>▶</Text>
                  </View>
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {translate(`video_${item.id}_title`)}
          </Text>
          <View style={styles.videoMeta}>
            <Text style={styles.channelName}>{item.channel}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{item.views} views</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{item.uploadTime}</Text>
            </View>
          </View>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {translate(`video_${item.id}_desc`)}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>👍</Text>
            <Text style={styles.actionButtonLabel}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💾</Text>
            <Text style={styles.actionButtonLabel}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📤</Text>
            <Text style={styles.actionButtonLabel}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [currentPlayingId, loadingVideos, handleVideoPress, handleWebViewLoad, handleWebViewLoadStart, handleWebViewError, translate]);

  const keyExtractor = useCallback((item: VideoItem) => item.id, []);

  const getItemLayout = useCallback((data: VideoItem[] | null | undefined, index: number) => ({
    length: verticalScale(420),
    offset: verticalScale(420) * index,
    index,
  }), []);

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
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={100}
          windowSize={10}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: verticalScale(80),
  },
  videoContainer: {
    backgroundColor: '#fff',
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(8),
    marginHorizontal: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  videoPlayerContainer: {
    height: verticalScale(200),
    backgroundColor: '#000',
    position: 'relative',
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
    marginTop: verticalScale(8),
    fontSize: moderateScale(14),
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
  playButton: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
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
    fontSize: moderateScale(24),
    color: '#3a3a8a',
    marginLeft: scale(3),
  },
  durationBadge: {
    position: 'absolute',
    bottom: verticalScale(8),
    right: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(4),
  },
  durationText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  videoInfo: {
    padding: moderateScale(12),
  },
  videoTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(6),
  },
  videoMeta: {
    marginBottom: verticalScale(8),
  },
  channelName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#3a3a8a',
    marginBottom: verticalScale(4),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: moderateScale(12),
    color: '#666',
  },
  metaDot: {
    fontSize: moderateScale(12),
    color: '#666',
    marginHorizontal: scale(6),
  },
  videoDescription: {
    fontSize: moderateScale(13),
    color: '#555',
    lineHeight: moderateScale(18),
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateScale(12),
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: verticalScale(8),
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(4),
  },
  actionButtonText: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(2),
  },
  actionButtonLabel: {
    fontSize: moderateScale(11),
    color: '#666',
    fontWeight: '500',
  },
});

export default Video;