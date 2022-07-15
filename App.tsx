import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

export type SimpleStackParams = {
    Home: undefined;
    Details: undefined;
};

function Clock() {
    const [time, setTime] = useState(getTime());
    useEffect(() => {
        setTimeout(() => {
            setTime(getTime());
        }, 1000);
    });

    return <Text style={{ fontWeight: "bold", fontSize: 20 }}>{time}</Text>;
}

function getTime() {
    return new Date().toISOString();
}

function HomeScreen({
    navigation,
}: NativeStackScreenProps<SimpleStackParams, "Home">) {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Clock />
            <Button
                title="Details..."
                onPress={() => {
                    navigation.navigate("Details");
                }}
            />
        </View>
    );
}

function DetailsScreen() {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Details Screen</Text>
        </View>
    );
}

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
