import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Image as RNImage } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { cn } from "@/utils/helpers";
import { getImageUrl } from "@/utils/movies";
import { Image } from "expo-image";

export default function LibraryScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist");
    const [user, setUser] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            supabase.auth.getUser().then(({ data }) => {
                setUser(data.user);
            });
        }, [])
    );

    const { data: watchlist, isLoading: listLoading, refetch: refetchList } = useQuery({
        queryKey: ["watchlist", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("watchlist")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!user && activeTab === "watchlist",
    });

    const { data: history, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
        queryKey: ["history", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("histories")
                .select("*")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!user && activeTab === "history",
    });

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) Alert.alert("Error", error.message);
        else {
            setUser(null);
            // Optionally navigate to Auth or stay here
            // @ts-ignore
            navigation.navigate("Auth");
        }
    };

    if (!user) {
        return (
            <View className="flex-1 bg-background justify-center items-center p-4">
                <Text className="text-white text-xl font-bold mb-2">Sign In Required</Text>
                <Text className="text-gray-400 text-center mb-6">Log in to view your watchlist and history.</Text>
                <TouchableOpacity
                    className="bg-red-600 px-6 py-3 rounded-lg"
                    // @ts-ignore
                    onPress={() => navigation.navigate("Auth")}
                >
                    <Text className="text-white font-bold">Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderItem = ({ item }: { item: any }) => {
        // History uses media_id, Watchlist uses id (which matches TMDB id usually)
        // Actually in watchlist table `id` is the TMDB ID.
        const tmdbId = activeTab === "watchlist" ? item.id : item.media_id;
        const title = item.title || item.name; // Histories might have title/name
        const posterPath = item.poster_path;

        return (
            <TouchableOpacity
                className="flex-row items-center mb-4 bg-gray-900 rounded-lg p-2"
                // @ts-ignore
                onPress={() => navigation.navigate("Detail", { id: tmdbId, type: item.type })}
            >
                <Image
                    source={{ uri: getImageUrl(posterPath, "poster") }}
                    style={{ width: 60, height: 90, borderRadius: 4 }}
                    contentFit="cover"
                />
                <View className="ml-3 flex-1">
                    <Text className="text-white font-bold text-base" numberOfLines={1}>{title}</Text>
                    <Text className="text-gray-400 text-sm capitalize">{item.type}</Text>
                    {activeTab === "history" && (
                        <Text className="text-gray-500 text-xs mt-1">
                            {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : ""}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const isLoading = activeTab === "watchlist" ? listLoading : historyLoading;
    const data = activeTab === "watchlist" ? watchlist : history;

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-800">
                <Text className="text-2xl font-bold text-white">Library</Text>
                <TouchableOpacity onPress={handleSignOut}>
                    <Text className="text-red-500">Sign Out</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row px-4 mt-2 mb-4">
                <TouchableOpacity
                    className={cn("mr-4 pb-2 border-b-2", activeTab === "watchlist" ? "border-red-600" : "border-transparent")}
                    onPress={() => setActiveTab("watchlist")}
                >
                    <Text className={cn("font-bold text-base", activeTab === "watchlist" ? "text-white" : "text-gray-400")}>
                        Watchlist
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={cn("pb-2 border-b-2", activeTab === "history" ? "border-red-600" : "border-transparent")}
                    onPress={() => setActiveTab("history")}
                >
                    <Text className={cn("font-bold text-base", activeTab === "history" ? "text-white" : "text-gray-400")}>
                        History
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <FlatList
                    data={data}
                    // @ts-ignore
                    keyExtractor={(item) => (activeTab === "watchlist" ? `${item.id}-${item.type}` : `${item.media_id}-${item.type}-${item.updated_at}`)}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View className="mt-10 items-center">
                            <Text className="text-gray-500">No items found.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}
