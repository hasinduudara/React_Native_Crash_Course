import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <>
            <StatusBar style="dark" />

            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Home',
                    }}
                />
                <Stack.Screen
                    name="details"
                    options={{
                        title: 'Details',
                        headerBackButtonDisplayMode: 'minimal',
                    }}
                />
            </Stack>
        </>
    );
}