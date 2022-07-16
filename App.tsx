import { Button, StyleSheet, Text, View, Switch } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
    createNativeStackNavigator,
    NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native";
import axios from "axios";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

const API_URL = "https://api.spacexdata.com/v3/launches";

export type SimpleStackParams = {
    Home: undefined;
    Graph: undefined;
};

type Data = DataPoint[];
interface DataPoint {
    time: number;
    lbs: number;
    kg: number;
}
type Points = Point[];
interface Point {
    time: number;
    weight: number;
}

type SpaceXRequestLaunches = SpaceXRequestLaunch[];
interface SpaceXRequestLaunch {
    launch_date_unix: number;
    rocket: {
        second_stage: {
            payloads: {
                payload_mass_kg: number;
                payload_mass_lbs: number;
            }[];
        };
    };
}

function HomeScreen() {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Clock />
            <Counter />
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
    return new Date().toUTCString();
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

function GraphScreen() {
    const [data, setData] = useState<Data>([]);
    const [points, setPoints] = useState<Points>([]);
    const [inLBS, setInLBS] = useState(false);

    const updatePoints = (d: Data, lbs: boolean) => {
        setPoints(
            d.map((item) => ({
                time: item.time,
                weight: lbs ? item.lbs : item.kg,
            })),
        );
    };

    useEffect(() => {
        axios
            .get(API_URL)
            .then((res) => res.data)
            .then((response: SpaceXRequestLaunches) => {
                const data = parseResponse(response);
                setData(data);
                updatePoints(data, false);
            })
            .catch((e) => {
                console.error(e);
            });
    }, []);

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text style={{ textAlign: "center" }}>
                Pulls launch data from SpaceX's API. Shows payload weight over
                time, toggle will switch between LBS and KG.
            </Text>
            <VictoryChart width={350} theme={VictoryTheme.material}>
                <VictoryBar data={points} x="time" y="weight" />
            </VictoryChart>
            <Switch
                onValueChange={(value) => {
                    setInLBS(value);
                    updatePoints(data, value);
                }}
                value={inLBS}
            />
        </View>
    );
}

function parseResponse(response: SpaceXRequestLaunches) {
    const data: Data = [];
    for (const launch of response) {
        const time = launch.launch_date_unix;
        let kg = 0;
        let lbs = 0;
        for (const payload of launch.rocket.second_stage.payloads) {
            if (payload.payload_mass_kg == null) {
                continue;
            }
            kg += payload.payload_mass_kg;
            lbs += payload.payload_mass_lbs;
        }
        const point: DataPoint = { time, kg, lbs };
        data.push(point);
    }
    return data;
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name == "Home") {
                            iconName = "home-outline";
                        } else if (route.name == "Graph") {
                            iconName = "stats-chart-outline";
                        }

                        return (
                            <Ionicons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Graph" component={GraphScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
