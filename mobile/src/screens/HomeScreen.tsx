import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { siteConfig } from "@/config/site";
import HorizontalMediaList from "@/components/HorizontalMediaList";
import { cn } from "@/utils/helpers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
    const [contentType, setContentType] = useState<"movie" | "tv">("movie");
    const insets = useSafeAreaInsets();

    const lists = contentType === "movie" ? siteConfig.queryLists.movies : siteConfig.queryLists.tvShows;

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <View className="flex-row items-center justify-between px-4 py-4">
                <Text className="text-2xl font-bold text-red-600">Cinextma</Text>
                <View className="flex-row bg-gray-800 rounded-lg p-1">
                    <TouchableOpacity
                        onPress={() => setContentType("movie")}
                        className={cn("px-4 py-1 rounded-md", contentType === "movie" ? "bg-red-600" : "bg-transparent")}
                    >
                        <Text className={cn("font-medium", contentType === "movie" ? "text-white" : "text-gray-400")}>Movies</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setContentType("tv")}
                        className={cn("px-4 py-1 rounded-md", contentType === "tv" ? "bg-yellow-500" : "bg-transparent")}
                    >
                        <Text className={cn("font-medium", contentType === "tv" ? "text-black" : "text-gray-400")}>TV Shows</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1">
                {lists.map((list) => (
                    <HorizontalMediaList
                        key={list.name}
                        title={list.name}
                        queryKey={[contentType, list.param]}
                        queryFn={list.query}
                        type={contentType}
                    />
                ))}
                <View className="h-20" />
            </ScrollView>
        </View>
    );
}
