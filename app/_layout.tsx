import { Stack } from "expo-router";
import { LanguageProvider } from './LanguageContext'; // Adjust the path if necessary

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="index" // Set index.tsx as the initial route
      >
        <Stack.Screen name="index" options={{ title: "Main Page" }} />
        <Stack.Screen name="Aww/home" options={{ title: "Home Page" }} />
        <Stack.Screen name="Aww/video" options={{ title: "Video Page" }} />
      </Stack>
    </LanguageProvider>
  );
}