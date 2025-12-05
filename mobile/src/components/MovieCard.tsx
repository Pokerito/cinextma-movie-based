import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Movie, TV, MovieDetails, TvShowDetails } from "tmdb-ts";
import { getImageUrl, mutateMovieTitle, mutateTvShowTitle } from "@/utils/movies";
import { useNavigation } from "@react-navigation/native";

interface MovieCardProps {
    item: Movie | TV | MovieDetails | TvShowDetails;
    type: "movie" | "tv";
    width?: number;
    height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function MovieCard({ item, type, width = SCREEN_WIDTH * 0.35, height = SCREEN_WIDTH * 0.52 }: MovieCardProps) {
    const navigation = useNavigation();
    const posterPath = item.poster_path;
    const imageUrl = getImageUrl(posterPath, "poster");

    // Type guards or loose access
    const title = type === "movie"
        ? mutateMovieTitle(item as Movie)
        : mutateTvShowTitle(item as TV);

    const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";

    const onPress = () => {
        // Navigate to detail screen
        // @ts-ignore
        navigation.navigate("Detail", { id: item.id, type });
    };

    return (
        <TouchableOpacity onPress={onPress} className="mr-3" style={{ width }}>
            <View className="rounded-xl overflow-hidden bg-gray-800" style={{ height }}>
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={500}
                />
                <View className="absolute top-1 right-1 bg-black/60 px-2 py-1 rounded-md">
                    <Text className="text-white text-xs font-bold text-yellow-500">★ {rating}</Text>
                </View>
            </View>
            <Text className="text-white font-medium mt-2 text-sm" numberOfLines={1}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
