import "./global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Providers from "./src/components/Providers";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Providers>
  );
}
