import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                {children}
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}
