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
          }}
      />
    </Stack>
  );
}
