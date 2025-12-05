import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import SectionHeader from "./SectionHeader";
import MovieCard from "./MovieCard";

interface HorizontalMediaListProps {
    title: string;
    queryKey: string[];
    queryFn: () => Promise<any>;
    type: "movie" | "tv";
    onSeeAll?: () => void;
}

export default function HorizontalMediaList({ title, queryKey, queryFn, type, onSeeAll }: HorizontalMediaListProps) {
    const { data, isLoading, error } = useQuery({
        queryKey,
        queryFn,
    });

    if (isLoading) {
        return (
            <View className="mb-6 h-[250px] justify-center">
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    }

    if (error || !data?.results) {
        return null;
    }

    const items = data.results;

    return (
        <View className="mb-6">
            <SectionHeader title={title} onSeeAll={onSeeAll} color={type === "movie" ? "primary" : "warning"} />
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard item={item} type={type} />}
            />
        </View>
    );
}
