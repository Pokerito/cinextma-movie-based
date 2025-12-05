import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "@/utils/helpers";

interface SectionHeaderProps {
    title: string;
    onSeeAll?: () => void;
    className?: string;
    color?: "primary" | "warning";
}

export default function SectionHeader({ title, onSeeAll, className, color = "primary" }: SectionHeaderProps) {
    return (
        <View className={cn("flex-row items-center justify-between px-4 py-2", className)}>
            <View className="flex-row items-center gap-2">
                <View className={cn("h-6 w-1 rounded-full", color === "primary" ? "bg-blue-600" : "bg-yellow-500")} />
                <Text className="text-xl font-bold text-white">{title}</Text>
            </View>
            {onSeeAll && (
                <TouchableOpacity onPress={onSeeAll}>
                    <Text className="text-base text-gray-400">See All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
