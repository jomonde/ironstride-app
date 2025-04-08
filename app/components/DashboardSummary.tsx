import React from "react";
import { View, Text, ScrollView } from "react-native";
import { BarChart2, TrendingUp, Clock, MapPin } from "lucide-react-native";
import { Image } from "expo-image";

interface WorkoutStat {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

interface HeartRateZone {
  zone: number;
  percentage: number;
  color: string;
  time: string;
}

interface DashboardSummaryProps {
  recentWorkout?: {
    date: string;
    type: string;
    distance: number;
    duration: string;
    pace: string;
  };
  heartRateZones?: HeartRateZone[];
}

export default function DashboardSummary({
  recentWorkout = {
    date: "Today",
    type: "Running",
    distance: 5.2,
    duration: "42:15",
    pace: "8:07",
  },
  heartRateZones = [
    { zone: 1, percentage: 15, color: "#3498db", time: "6:20" },
    { zone: 2, percentage: 40, color: "#2ecc71", time: "16:54" },
    { zone: 3, percentage: 30, color: "#f1c40f", time: "12:40" },
    { zone: 4, percentage: 10, color: "#e67e22", time: "4:13" },
    { zone: 5, percentage: 5, color: "#e74c3c", time: "2:08" },
  ],
}: DashboardSummaryProps) {
  const workoutStats: WorkoutStat[] = [
    {
      icon: <MapPin size={20} color="#3498db" />,
      label: "Distance",
      value: `${recentWorkout.distance} km`,
      color: "#3498db",
    },
    {
      icon: <Clock size={20} color="#2ecc71" />,
      label: "Duration",
      value: recentWorkout.duration,
      color: "#2ecc71",
    },
    {
      icon: <TrendingUp size={20} color="#f1c40f" />,
      label: "Pace",
      value: `${recentWorkout.pace} min/km`,
      color: "#f1c40f",
    },
  ];

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      {/* Recent Workout Summary */}
      <View className="mb-4">
        <Text className="text-lg font-bold mb-2">Recent Workout</Text>
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
            <TrendingUp size={24} color="#3498db" />
          </View>
          <View>
            <Text className="text-sm text-gray-500">{recentWorkout.date}</Text>
            <Text className="text-base font-semibold">
              {recentWorkout.type}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          {workoutStats.map((stat, index) => (
            <View
              key={index}
              className="items-center bg-gray-50 p-3 rounded-lg flex-1 mx-1"
            >
              <View className="mb-1">{stat.icon}</View>
              <Text className="text-xs text-gray-500">{stat.label}</Text>
              <Text className="text-sm font-semibold">{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Heart Rate Zone Distribution */}
      <View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">Heart Rate Zones</Text>
          <BarChart2 size={20} color="#718096" />
        </View>

        {/* Zone Distribution Chart */}
        <View className="mb-3">
          <View className="flex-row h-8 rounded-lg overflow-hidden">
            {heartRateZones.map((zone, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: zone.color,
                  width: `${zone.percentage}%`,
                }}
              />
            ))}
          </View>
        </View>

        {/* Zone Details */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          {heartRateZones.map((zone, index) => (
            <View key={index} className="mr-3 items-center">
              <View
                className="w-4 h-4 rounded-full mb-1"
                style={{ backgroundColor: zone.color }}
              />
              <Text className="text-xs font-medium">Zone {zone.zone}</Text>
              <Text className="text-xs text-gray-500">{zone.time}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
