import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, RegisterFormSchema, LoginFormInput, RegisterFormInput } from "../schemas/auth";
import { supabase } from "@/utils/supabase/client";
import { useNavigation } from "@react-navigation/native";
import { cn } from "@/utils/helpers";

export default function AuthScreen() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const {
        control: loginControl,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm<LoginFormInput>({
        resolver: zodResolver(LoginFormSchema),
    });

    const {
        control: registerControl,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
    } = useForm<RegisterFormInput>({
        resolver: zodResolver(RegisterFormSchema),
    });

    const onLogin = async (data: LoginFormInput) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.loginPassword,
        });
        setLoading(false);
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            // Navigate to main app or let auth listener handle it
            // For now, assuming RootNavigator handles auth check/navigation
            // But RootNavigator is stack based, we might navigate to "Main"
            // @ts-ignore
            navigation.navigate("Main");
        }
    };

    const onRegister = async (data: RegisterFormInput) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    username: data.username,
                }
            }
        });
        setLoading(false);
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "Please check your email to verify your account.");
            setMode("login");
        }
    };

    return (
        <View className="flex-1 bg-background justify-center p-6">
            <Text className="text-3xl font-bold text-foreground mb-8 text-center text-white">
                {mode === "login" ? "Welcome Back" : "Create Account"}
            </Text>

            <View className="flex-row mb-6 bg-gray-800 rounded-lg p-1">
                <TouchableOpacity
                    className={cn("flex-1 py-2 rounded-md items-center", mode === "login" ? "bg-primary-500 bg-blue-600" : "")}
                    onPress={() => setMode("login")}
                >
                    <Text className="text-white font-medium">Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={cn("flex-1 py-2 rounded-md items-center", mode === "register" ? "bg-primary-500 bg-blue-600" : "")}
                    onPress={() => setMode("register")}
                >
                    <Text className="text-white font-medium">Register</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {mode === "login" ? (
                    <View>
                        <Controller
                            control={loginControl}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-gray-400 mb-1">Email</Text>
                                    <TextInput
                                        className="bg-gray-800 text-white p-3 rounded-lg"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Enter email"
                                        placeholderTextColor="#666"
                                        autoCapitalize="none"
                                    />
                                    {loginErrors.email && <Text className="text-red-500 text-sm mt-1">{loginErrors.email.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={loginControl}
                            name="loginPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-6">
                                    <Text className="text-gray-400 mb-1">Password</Text>
                                    <TextInput
                                        className="bg-gray-800 text-white p-3 rounded-lg"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Enter password"
                                        placeholderTextColor="#666"
                                        secureTextEntry
                                    />
                                    {loginErrors.loginPassword && <Text className="text-red-500 text-sm mt-1">{loginErrors.loginPassword.message}</Text>}
                                </View>
                            )}
                        />
                        <TouchableOpacity
                            className="bg-blue-600 p-4 rounded-lg items-center"
                            onPress={handleLoginSubmit(onLogin)}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Controller
                            control={registerControl}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-gray-400 mb-1">Username</Text>
                                    <TextInput
                                        className="bg-gray-800 text-white p-3 rounded-lg"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Username"
                                        placeholderTextColor="#666"
                                        autoCapitalize="none"
                                    />
                                    {registerErrors.username && <Text className="text-red-500 text-sm mt-1">{registerErrors.username.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={registerControl}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-gray-400 mb-1">Email</Text>
                                    <TextInput
                                        className="bg-gray-800 text-white p-3 rounded-lg"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Enter email"
                                        placeholderTextColor="#666"
                                        autoCapitalize="none"
                                    />
                                    {registerErrors.email && <Text className="text-red-500 text-sm mt-1">{registerErrors.email.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={registerControl}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <Text className="text-gray-400 mb-1">Password</Text>
                                    <TextInput
                                        className="bg-gray-800 text-white p-3 rounded-lg"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Enter password"
                                        placeholderTextColor="#666"
                                        secureTextEntry
                                    />
                                    {registerErrors.password && <Text className="text-red-500 text-sm mt-1">{registerErrors.password.message}</Text>}
                                </View>
                            )}
                        />
                        <Controller
                            control={registerControl}
                            name="confirm"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-6">
                                    <Text className="text-gray-400 mb-1">Confirm Password</Text>
                                    <TextInput
                                        className="bg-gray-800 text-white p-3 rounded-lg"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Confirm password"
                                        placeholderTextColor="#666"
                                        secureTextEntry
                                    />
                                    {registerErrors.confirm && <Text className="text-red-500 text-sm mt-1">{registerErrors.confirm.message}</Text>}
                                </View>
                            )}
                        />
                        <TouchableOpacity
                            className="bg-blue-600 p-4 rounded-lg items-center"
                            onPress={handleRegisterSubmit(onRegister)}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign Up</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
