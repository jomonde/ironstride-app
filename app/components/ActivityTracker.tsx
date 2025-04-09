import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Play, Pause, StopCircle, MapPin, Heart } from "lucide-react-native";

export default function ActivityTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState("0:00");
  const [currentHeartRate, setCurrentHeartRate] = useState(0);
  const [currentZone, setCurrentZone] = useState(0);

  // Mock data for demonstration
  const mockStartTracking = () => {
    setIsTracking(true);
    setIsPaused(false);
    // In a real app, you would start GPS tracking here
    // and set up interval for updating stats
  };

  const mockPauseTracking = () => {
    setIsPaused(!isPaused);
    // In a real app, you would pause/resume GPS tracking
  };

  const mockStopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    setElapsedTime(0);
    setDistance(0);
    setCurrentPace("0:00");
    // In a real app, you would stop GPS tracking and save the activity
  };

  // Helper function to format time (seconds -> MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get color for heart rate zone
  const getZoneColor = (zone: number) => {
    const colors = ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"];
    return zone > 0 && zone <= 5 ? colors[zone - 1] : "#718096";
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm">
      {!isTracking ? (
        // Start screen
        <View className="items-center py-8">
          <Text className="text-2xl font-bold mb-8">Start Activity</Text>
          <TouchableOpacity
            onPress={mockStartTracking}
            className="bg-rose-500 w-20 h-20 rounded-full items-center justify-center mb-4"
          >
            <Play size={40} color="white" />
          </TouchableOpacity>
          <Text className="text-gray-500">Tap to start tracking</Text>
        </View>
      ) : (
        // Tracking screen
        <View>
          {/* Stats display */}
          <View className="mb-6">
            <Text className="text-xl font-bold mb-4">Current Activity</Text>

            {/* Time and Distance */}
            <View className="flex-row justify-between mb-4">
              <View className="items-center bg-gray-50 p-3 rounded-lg flex-1 mr-2">
                <Text className="text-xs text-gray-500 mb-1">Time</Text>
                <Text className="text-2xl font-semibold">
                  {formatTime(elapsedTime)}
                </Text>
              </View>
              <View className="items-center bg-gray-50 p-3 rounded-lg flex-1 ml-2">
                <Text className="text-xs text-gray-500 mb-1">Distance</Text>
                <Text className="text-2xl font-semibold">
                  {distance.toFixed(2)} km
                </Text>
              </View>
            </View>

            {/* Pace and Heart Rate */}
            <View className="flex-row justify-between">
              <View className="items-center bg-gray-50 p-3 rounded-lg flex-1 mr-2">
                <View className="flex-row items-center mb-1">
                  <MapPin size={16} color="#718096" />
                  <Text className="text-xs text-gray-500 ml-1">Pace</Text>
                </View>
                <Text className="text-xl font-semibold">{currentPace} /km</Text>
              </View>
              <View className="items-center bg-gray-50 p-3 rounded-lg flex-1 ml-2">
                <View className="flex-row items-center mb-1">
                  <Heart size={16} color="#e74c3c" />
                  <Text className="text-xs text-gray-500 ml-1">Heart Rate</Text>
                </View>
                <Text className="text-xl font-semibold">
                  {currentHeartRate} bpm
                </Text>
              </View>
            </View>
          </View>

          {/* Heart Rate Zone Indicator */}
          <View className="mb-6">
            <Text className="text-sm font-medium mb-2">Heart Rate Zone</Text>
            <View className="h-8 bg-gray-200 rounded-lg overflow-hidden">
              <View
                className="h-full"
                style={{
                  width: `${currentZone * 20}%`,
                  backgroundColor: getZoneColor(currentZone),
                }}
              />
            </View>
            <Text className="text-sm text-center mt-1">
              {currentZone > 0 ? `Zone ${currentZone}` : "Not in zone"}
            </Text>
          </View>

          {/* Controls */}
          <View className="flex-row justify-center space-x-4">
            {isPaused ? (
              <TouchableOpacity
                onPress={mockPauseTracking}
                className="bg-green-500 w-16 h-16 rounded-full items-center justify-center"
              >
                <Play size={32} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={mockPauseTracking}
                className="bg-yellow-500 w-16 h-16 rounded-full items-center justify-center"
              >
                <Pause size={32} color="white" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={mockStopTracking}
              className="bg-red-500 w-16 h-16 rounded-full items-center justify-center"
            >
              <StopCircle size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
