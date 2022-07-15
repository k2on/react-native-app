import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Switch } from "react-native";
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

function HomeScreen({
    navigation,
}: NativeStackScreenProps<SimpleStackParams, "Home">) {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Clock />
            <Counter />
            <Button
                title="Details..."
                onPress={() => {
                    navigation.navigate("Details");
                }}
            />
        </View>
    );
}

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

function Counter() {
    const [byTwo, setByTwo] = useState(false);
    const [counter, setCounter] = useState(0);
    const onChange = () => {
        setCounter(0);
        setByTwo(!byTwo);
    };
    const changeCounter = (negative: boolean) => {
        return () => {
            const modification = (byTwo ? 2 : 1) * (negative ? -1 : 1);
            setCounter(counter + modification);
        };
    };
    const desc = changeCounter(true);
    const inc = changeCounter(false);

    return (
        <View>
            <View>
                <Button title="-" onPress={desc} />
                <Text>{counter}</Text>
                <Button title="+" onPress={inc} />
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={byTwo ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onChange}
                value={byTwo}
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
