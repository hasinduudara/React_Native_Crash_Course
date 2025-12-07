import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
          name="index" // matches the file name
          options={{
              title: 'Home',
          }}
      />
      <Stack.Screen
          name="details" // matches the file name
          options={{
              title: 'Details',
              headerBackButtonDisplayMode: 'minimal',
              // presentation: 'modal',
              // sheetAllowedDetents: [0.3, 0.5, 0.7],
              // sheetGrabberVisible: true,
              // headerShown: false,
          }}
      />
    </Stack>
  );
}
