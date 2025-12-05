import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import { tmdb } from "@/api/tmdb";
import MovieCard from "@/components/MovieCard";
import { cn, isEmpty } from "@/utils/helpers";

const SCREEN_WIDTH = Dimensions.get("window").width;
const COLUMN_COUNT = 3;
const ITEM_WIDTH = SCREEN_WIDTH / COLUMN_COUNT - 16;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    const fetchSearchResults = async ({ pageParam = 1 }) => {
        if (isEmpty(debouncedQuery)) return { results: [], total_pages: 0, page: 1 };
        return tmdb.search.multi({ query: debouncedQuery, page: pageParam });
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: fetchSearchResults,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
        enabled: !!debouncedQuery,
    });

    const results = data?.pages.flatMap((page) => page.results) || [];

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <View className="px-4 py-2">
                <Text className="text-xl font-bold text-white mb-2">Search</Text>
                <TextInput
                    className="bg-gray-800 text-white p-3 rounded-lg"
                    placeholder="Search movies, tv shows, people..."
                    placeholderTextColor="#888"
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                />
            </View>

            {isLoading && <ActivityIndicator size="large" color="#fff" className="mt-4" />}

            <FlatList
                data={results}
                numColumns={COLUMN_COUNT}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color="#fff" className="py-4" /> : null}
                ListEmptyComponent={
                    !isLoading && debouncedQuery ? (
                        <View className="items-center mt-10"><Text className="text-gray-400">No results found.</Text></View>
                    ) : null
                }
                renderItem={({ item }) => {
                    if (item.media_type === "person") return null; // Skip people for now or render differently
                    const type = item.media_type === "movie" ? "movie" : "tv";
                    return (
                        <MovieCard
                            // @ts-ignore
                            item={item}
                            type={type}
                            width={ITEM_WIDTH}
                            height={ITEM_HEIGHT}
                        />
                    );
                }}
            />
        </View>
    );
}
