import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, SafeAreaView } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { getMoviePlayers, getTvShowPlayers, PlayersProps } from "@/utils/players";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ScreenOrientation from 'expo-screen-orientation';

type PlayerRouteParams = {
    Player: {
        id: number;
        type: "movie" | "tv";
        season?: number;
        episode?: number;
    };
};

export default function PlayerScreen() {
    const route = useRoute<RouteProp<PlayerRouteParams, "Player">>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { id, type, season = 1, episode = 1 } = route.params;

    const [players, setPlayers] = useState<PlayersProps[]>([]);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

    useEffect(() => {
        const p = type === "movie"
            ? getMoviePlayers(id)
            : getTvShowPlayers(id, season, episode);
        setPlayers(p);
    }, [id, type, season, episode]);

    useEffect(() => {
        // Lock to landscape for better viewing experience
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);

    const currentPlayer = players[currentSourceIndex];

    if (!currentPlayer) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <TouchableOpacity
                className="absolute top-4 left-4 z-20 bg-black/50 p-2 rounded-full"
                onPress={() => navigation.goBack()}
            >
                <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>

            <View className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-lg flex-row gap-2">
                <Text className="text-white text-xs mr-2 self-center">Source: {currentPlayer.title}</Text>
                <TouchableOpacity onPress={() => {
                    const nextIndex = (currentSourceIndex + 1) % players.length;
                    setCurrentSourceIndex(nextIndex);
                }}>
                    <Text className="text-blue-400 font-bold">Switch</Text>
                </TouchableOpacity>
            </View>

            <WebView
                source={{ uri: currentPlayer.source }}
                style={{ flex: 1, backgroundColor: 'black' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
            />
        </View>
    );
}
