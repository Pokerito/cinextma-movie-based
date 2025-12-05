import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/api/tmdb";
import { getImageUrl, movieDurationString } from "@/utils/movies";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import HorizontalMediaList from "@/components/HorizontalMediaList";
import SectionHeader from "@/components/SectionHeader";
import { MovieDetails, TvShowDetails } from "tmdb-ts";

type DetailRouteParams = {
    Detail: {
        id: number;
        type: "movie" | "tv";
    };
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function DetailScreen() {
    const route = useRoute<RouteProp<DetailRouteParams, "Detail">>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { id, type } = route.params;

    const { data: details, isLoading } = useQuery({
        queryKey: ["detail", type, id],
        queryFn: async () => {
            if (type === "movie") {
                return (await tmdb.movies.details(id)) as MovieDetails;
            } else {
                return (await tmdb.tvShows.details(id)) as TvShowDetails;
            }
        },
    });

    const { data: credits } = useQuery({
        queryKey: ["credits", type, id],
        queryFn: () => type === "movie" ? tmdb.movies.credits(id) : tmdb.tvShows.credits(id),
    });

    if (isLoading || !details) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    const backdropUrl = getImageUrl(details.backdrop_path, "backdrop", true);
    const posterUrl = getImageUrl(details.poster_path, "poster");

    // @ts-ignore
    const title = type === "movie" ? (details as MovieDetails).title : (details as TvShowDetails).name;
    // @ts-ignore
    const releaseDate = type === "movie" ? (details as MovieDetails).release_date : (details as TvShowDetails).first_air_date;
    // @ts-ignore
    const runtime = type === "movie" ? (details as MovieDetails).runtime : (details as TvShowDetails).episode_run_time?.[0];

    const voteAverage = details.vote_average ? details.vote_average.toFixed(1) : "N/A";
    const overview = details.overview;
    const genres = details.genres || [];

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={{ height: SCREEN_HEIGHT * 0.5 }}>
                <Image
                    source={{ uri: backdropUrl }}
                    className="absolute w-full h-full"
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', '#000000']}
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                />
                <TouchableOpacity
                    className="absolute top-4 left-4 bg-black/50 p-2 rounded-full z-10"
                    style={{ marginTop: insets.top }}
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-bold">← Back</Text>
                </TouchableOpacity>

                <View className="absolute bottom-0 px-4 pb-6 w-full flex-row items-end gap-4">
                    <Image
                        source={{ uri: posterUrl }}
                        className="w-24 h-36 rounded-lg shadow-lg"
                        resizeMode="cover"
                    />
                    <View className="flex-1">
                        <Text className="text-white text-2xl font-bold shadow-md">{title}</Text>
                        <Text className="text-gray-300 text-sm mt-1">
                            {releaseDate?.split("-")[0]} • {movieDurationString(runtime)} • {voteAverage} ★
                        </Text>
                        <View className="flex-row gap-2 mt-2 flex-wrap">
                            {genres.slice(0, 3).map((g: any) => (
                                <View key={g.id} className="bg-gray-800 px-2 py-0.5 rounded-md">
                                    <Text className="text-gray-400 text-xs">{g.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

            <View className="flex-row px-4 py-4 gap-4">
                <TouchableOpacity
                    className="flex-1 bg-white py-3 rounded-lg items-center"
                    // @ts-ignore
                    onPress={() => navigation.navigate("Player", { id, type })}
                >
                    <Text className="text-black font-bold text-lg">Play</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-gray-800 py-3 rounded-lg items-center border border-gray-700">
                    <Text className="text-white font-bold text-lg">+ List</Text>
                </TouchableOpacity>
            </View>

            <View className="px-4 mb-6">
                <Text className="text-gray-300 leading-6">{overview}</Text>
            </View>

            {credits?.cast && credits.cast.length > 0 && (
                <View className="mb-6">
                    <SectionHeader title="Top Cast" />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {credits.cast.slice(0, 10).map((person) => (
                            <View key={person.id} className="mr-4 items-center w-20">
                                <Image
                                    source={{ uri: getImageUrl(person.profile_path, "avatar") }}
                                    className="w-16 h-16 rounded-full bg-gray-700"
                                    resizeMode="cover"
                                />
                                <Text className="text-gray-300 text-xs mt-1 text-center" numberOfLines={2}>{person.name}</Text>
                                <Text className="text-gray-500 text-[10px] text-center" numberOfLines={1}>{person.character}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            <HorizontalMediaList
                title="Recommendations"
                queryKey={["recommendations", type, id]}
                queryFn={() => type === "movie" ? tmdb.movies.recommendations(id) : tmdb.tvShows.recommendations(id)}
                type={type}
            />

        </ScrollView>
    );
}
