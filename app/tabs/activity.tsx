import React from "react";
import { View, Text, ScrollView } from "react-native";
import ActivityTracker from "../components/ActivityTracker";

export default function ActivityScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <ActivityTracker />
      </View>
    </ScrollView>
  );
}
