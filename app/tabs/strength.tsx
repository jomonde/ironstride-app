import React from "react";
import { View, ScrollView } from "react-native";
import StrengthTracker from "../components/StrengthTracker";

export default function StrengthScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <StrengthTracker />
      </View>
    </ScrollView>
  );
}
