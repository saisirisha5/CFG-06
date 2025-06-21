import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="index" // Set index.tsx as the initial route
    >
      <Stack.Screen name="index" options={{ title: "Main Page" }} />
      <Stack.Screen name="Aww/home" options={{ title: "Home Page" }} />
      <Stack.Screen name="Aww/video" options={{ title: "Video Page" }} />
      
    </Stack>
  );
}