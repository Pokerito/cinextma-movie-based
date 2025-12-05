import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { tmdb } from "@/api/tmdb";
import MovieCard from "@/components/MovieCard";
import { cn } from "@/utils/helpers";
import { Movie, TV } from "tmdb-ts";

const SCREEN_WIDTH = Dimensions.get("window").width;
const COLUMN_COUNT = 3;
const ITEM_WIDTH = SCREEN_WIDTH / COLUMN_COUNT - 16;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

type SortOption = "discover" | "popular" | "top_rated" | "upcoming" | "now_playing" | "on_the_air" | "trending";

export default function DiscoverScreen() {
    const insets = useSafeAreaInsets();
    const [contentType, setContentType] = useState<"movie" | "tv">("movie");
    const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
    const [sortOption, setSortOption] = useState<SortOption>("discover");

    const { data: genresData } = useQuery({
        queryKey: ["genres", contentType],
        queryFn: () => contentType === "movie" ? tmdb.genres.movies() : tmdb.genres.tvShows(),
    });

    const fetchProjects = async ({ pageParam = 1 }: { pageParam: number }) => {
        if (sortOption === "discover" || selectedGenres.size > 0) {
            const params: any = { page: pageParam };
            if (selectedGenres.size > 0) {
                params.with_genres = Array.from(selectedGenres).join(",");
            }
            return contentType === "movie"
                ? tmdb.discover.movie(params)
                : tmdb.discover.tvShow(params);
        }

        switch (sortOption) {
            case "popular":
                return contentType === "movie" ? tmdb.movies.popular({ page: pageParam }) : tmdb.tvShows.popular({ page: pageParam });
            case "top_rated":
                return contentType === "movie" ? tmdb.movies.topRated({ page: pageParam }) : tmdb.tvShows.topRated({ page: pageParam });
            case "upcoming":
                return tmdb.movies.upcoming({ page: pageParam });
            case "now_playing":
                return tmdb.movies.nowPlaying({ page: pageParam });
            case "on_the_air":
                return tmdb.tvShows.onTheAir({ page: pageParam });
            case "trending":
                return tmdb.trending.trending(contentType, "week", { page: pageParam }); // tmdb-ts trending params might need checking but object usually works for generic fetchers or handled by lib
            default:
                return contentType === "movie" ? tmdb.discover.movie({ page: pageParam }) : tmdb.discover.tvShow({ page: pageParam });
        }
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["discover", contentType, sortOption, Array.from(selectedGenres).join(",")],
        queryFn: fetchProjects,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

    const toggleGenre = (id: number) => {
        const newGenres = new Set(selectedGenres);
        if (newGenres.has(id)) {
            newGenres.delete(id);
        } else {
            newGenres.add(id);
        }
        setSelectedGenres(newGenres);
        if (sortOption !== 'discover' && newGenres.size > 0) {
            setSortOption('discover');
        }
    };

    const results = useMemo(() => {
        return data?.pages.flatMap((page) => page.results) || [];
    }, [data]);

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <View>
                <View className="flex-row items-center justify-between px-4 py-2">
                    <Text className="text-xl font-bold text-white">Discover</Text>
                    <View className="flex-row bg-gray-800 rounded-lg p-0.5">
                        <TouchableOpacity
                            onPress={() => { setContentType("movie"); setSelectedGenres(new Set()); setSortOption('discover'); }}
                            className={cn("px-3 py-1 rounded-md", contentType === "movie" ? "bg-red-600" : "bg-transparent")}
                        >
                            <Text className={cn("text-xs font-bold", contentType === "movie" ? "text-white" : "text-gray-400")}>Movies</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setContentType("tv"); setSelectedGenres(new Set()); setSortOption('discover'); }}
                            className={cn("px-3 py-1 rounded-md", contentType === "tv" ? "bg-yellow-500" : "bg-transparent")}
                        >
                            <Text className={cn("text-xs font-bold", contentType === "tv" ? "text-black" : "text-gray-400")}>TV</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="h-10 mb-2">
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
                        data={genresData?.genres || []}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => toggleGenre(item.id)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full mr-2 border",
                                    selectedGenres.has(item.id)
                                        ? (contentType === "movie" ? "bg-red-600 border-red-600" : "bg-yellow-500 border-yellow-500")
                                        : "bg-transparent border-gray-600"
                                )}
                            >
                                <Text className={cn("text-xs", selectedGenres.has(item.id) ? "text-white font-bold" : "text-gray-300")}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
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
                    renderItem={({ item }) => (
                        <MovieCard
                            item={item}
                            type={contentType}
                            width={ITEM_WIDTH}
                            height={ITEM_HEIGHT}
                        />
                    )}
                />
            )}
        </View>
    );
}
