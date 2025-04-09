import React from "react";
import { View, ScrollView } from "react-native";
import DashboardSummary from "../components/DashboardSummary";

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <DashboardSummary />
      </View>
    </ScrollView>
  );
}
