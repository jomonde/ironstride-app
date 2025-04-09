import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Heart,
  ArrowRight,
  Check,
  User,
  Weight,
  Target,
} from "lucide-react-native";

interface OnboardingFlowProps {
  onComplete?: (userData: UserData) => void;
}

interface UserData {
  age: number;
  weight: number;
  fitnessGoal: "endurance" | "strength" | "hybrid" | "generalHealth";
  trainingFocus: "cardio" | "strength" | "balanced";
  hrMax: number;
  zones: {
    zone1: { min: number; max: number };
    zone2: { min: number; max: number };
    zone3: { min: number; max: number };
    zone4: { min: number; max: number };
    zone5: { min: number; max: number };
  };
}

export default function OnboardingFlow({
  onComplete = () => {},
}: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    age: 30,
    weight: 70,
    fitnessGoal: "generalHealth",
    trainingFocus: "balanced",
    hrMax: 0,
    zones: {
      zone1: { min: 0, max: 0 },
      zone2: { min: 0, max: 0 },
      zone3: { min: 0, max: 0 },
      zone4: { min: 0, max: 0 },
      zone5: { min: 0, max: 0 },
    },
  });

  const calculateHRMax = (age: number) => {
    // Tanaka Formula: HRmax = 208 - (0.7 × age)
    return Math.round(208 - 0.7 * age);
  };

  const calculateZones = (hrMax: number) => {
    return {
      zone1: { min: Math.round(hrMax * 0.5), max: Math.round(hrMax * 0.6) },
      zone2: { min: Math.round(hrMax * 0.6) + 1, max: Math.round(hrMax * 0.7) },
      zone3: { min: Math.round(hrMax * 0.7) + 1, max: Math.round(hrMax * 0.8) },
      zone4: { min: Math.round(hrMax * 0.8) + 1, max: Math.round(hrMax * 0.9) },
      zone5: { min: Math.round(hrMax * 0.9) + 1, max: hrMax },
    };
  };

  const handleNext = () => {
    if (step === 3) {
      // Calculate HR max and zones before moving to step 4
      const hrMax = calculateHRMax(userData.age);
      const zones = calculateZones(hrMax);
      setUserData({ ...userData, hrMax, zones });
    }

    if (step === 4) {
      // Set training focus based on fitness goal
      let trainingFocus = "balanced";
      if (userData.fitnessGoal === "endurance") trainingFocus = "cardio";
      if (userData.fitnessGoal === "strength") trainingFocus = "strength";
      if (userData.fitnessGoal === "hybrid") trainingFocus = "balanced";
      setUserData({ ...userData, trainingFocus });
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      // Onboarding complete
      onComplete(userData);
      router.push("/");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View className="bg-white p-6 rounded-xl shadow-sm">
            <View className="items-center mb-8">
              <Heart size={64} color="#f43f5e" />
              <Text className="text-2xl font-bold mt-4 text-center">
                Welcome to IronStride
              </Text>
              <Text className="text-base text-gray-600 mt-2 text-center">
                Let's set up your profile to personalize your fitness journey
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNext}
              className="bg-rose-500 py-4 px-6 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg mr-2">
                Get Started
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View className="bg-white p-6 rounded-xl shadow-sm">
            <View className="items-center mb-6">
              <User size={48} color="#f43f5e" />
              <Text className="text-xl font-bold mt-4">About You</Text>
            </View>

            <View className="mb-6">
              <Text className="text-base font-medium mb-2">Your Age</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-lg"
                keyboardType="numeric"
                value={userData.age.toString()}
                onChangeText={(text) => {
                  const age = parseInt(text) || 0;
                  setUserData({ ...userData, age });
                }}
                placeholder="Enter your age"
              />
              <Text className="text-sm text-gray-500 mt-1">
                We'll use this to calculate your optimal heart rate zones
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className="bg-rose-500 py-4 px-6 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg mr-2">
                Continue
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View className="bg-white p-6 rounded-xl shadow-sm">
            <View className="items-center mb-6">
              <Weight size={48} color="#f43f5e" />
              <Text className="text-xl font-bold mt-4">Your Weight</Text>
            </View>

            <View className="mb-6">
              <Text className="text-base font-medium mb-2">Weight (kg)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-lg"
                keyboardType="numeric"
                value={userData.weight.toString()}
                onChangeText={(text) => {
                  const weight = parseFloat(text) || 0;
                  setUserData({ ...userData, weight });
                }}
                placeholder="Enter your weight"
              />
              <Text className="text-sm text-gray-500 mt-1">
                Optional, helps with calorie calculations
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className="bg-rose-500 py-4 px-6 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg mr-2">
                Continue
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        );

      case 4:
        return (
          <View className="bg-white p-6 rounded-xl shadow-sm">
            <View className="items-center mb-6">
              <Target size={48} color="#f43f5e" />
              <Text className="text-xl font-bold mt-4">Fitness Goals</Text>
            </View>

            <View className="mb-6 space-y-3">
              <Text className="text-base font-medium mb-1">
                Select your primary goal:
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setUserData({ ...userData, fitnessGoal: "endurance" })
                }
                className={`border rounded-lg p-4 flex-row items-center ${userData.fitnessGoal === "endurance" ? "border-rose-500 bg-rose-50" : "border-gray-300"}`}
              >
                {userData.fitnessGoal === "endurance" && (
                  <View className="mr-2 bg-rose-500 rounded-full p-1">
                    <Check size={16} color="white" />
                  </View>
                )}
                <Text
                  className={`text-lg ${userData.fitnessGoal === "endurance" ? "font-medium text-rose-700" : ""}`}
                >
                  Endurance / Cardio
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setUserData({ ...userData, fitnessGoal: "strength" })
                }
                className={`border rounded-lg p-4 flex-row items-center ${userData.fitnessGoal === "strength" ? "border-rose-500 bg-rose-50" : "border-gray-300"}`}
              >
                {userData.fitnessGoal === "strength" && (
                  <View className="mr-2 bg-rose-500 rounded-full p-1">
                    <Check size={16} color="white" />
                  </View>
                )}
                <Text
                  className={`text-lg ${userData.fitnessGoal === "strength" ? "font-medium text-rose-700" : ""}`}
                >
                  Strength / Gym
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setUserData({ ...userData, fitnessGoal: "hybrid" })
                }
                className={`border rounded-lg p-4 flex-row items-center ${userData.fitnessGoal === "hybrid" ? "border-rose-500 bg-rose-50" : "border-gray-300"}`}
              >
                {userData.fitnessGoal === "hybrid" && (
                  <View className="mr-2 bg-rose-500 rounded-full p-1">
                    <Check size={16} color="white" />
                  </View>
                )}
                <Text
                  className={`text-lg ${userData.fitnessGoal === "hybrid" ? "font-medium text-rose-700" : ""}`}
                >
                  Hybrid / Tactical
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setUserData({ ...userData, fitnessGoal: "generalHealth" })
                }
                className={`border rounded-lg p-4 flex-row items-center ${userData.fitnessGoal === "generalHealth" ? "border-rose-500 bg-rose-50" : "border-gray-300"}`}
              >
                {userData.fitnessGoal === "generalHealth" && (
                  <View className="mr-2 bg-rose-500 rounded-full p-1">
                    <Check size={16} color="white" />
                  </View>
                )}
                <Text
                  className={`text-lg ${userData.fitnessGoal === "generalHealth" ? "font-medium text-rose-700" : ""}`}
                >
                  General Health
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className="bg-rose-500 py-4 px-6 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg mr-2">
                Continue
              </Text>
              <ArrowRight size={20} color="white" />
            </TouchableOpacity>
          </View>
        );

      case 5:
        return (
          <View className="bg-white p-6 rounded-xl shadow-sm">
            <View className="items-center mb-6">
              <Heart size={48} color="#f43f5e" />
              <Text className="text-xl font-bold mt-4">
                Your Heart Rate Zones
              </Text>
              <Text className="text-base text-gray-600 mt-1 text-center">
                Based on your age of {userData.age}, we've calculated your
                optimal training zones
              </Text>
            </View>

            <View className="mb-6 space-y-3">
              <Text className="text-base font-medium">
                Maximum Heart Rate: {userData.hrMax} BPM
              </Text>

              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-blue-400 mr-2" />
                    <Text className="font-medium">Zone 1</Text>
                  </View>
                  <Text>
                    {userData.zones.zone1.min} - {userData.zones.zone1.max} BPM
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-green-400 mr-2" />
                    <Text className="font-medium">Zone 2</Text>
                  </View>
                  <Text>
                    {userData.zones.zone2.min} - {userData.zones.zone2.max} BPM
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />
                    <Text className="font-medium">Zone 3</Text>
                  </View>
                  <Text>
                    {userData.zones.zone3.min} - {userData.zones.zone3.max} BPM
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-orange-400 mr-2" />
                    <Text className="font-medium">Zone 4</Text>
                  </View>
                  <Text>
                    {userData.zones.zone4.min} - {userData.zones.zone4.max} BPM
                  </Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full bg-red-500 mr-2" />
                    <Text className="font-medium">Zone 5</Text>
                  </View>
                  <Text>
                    {userData.zones.zone5.min} - {userData.zones.zone5.max} BPM
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-gray-500 mt-2">
                Training in different zones helps achieve different fitness
                goals. You'll see these colors during your workouts.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNext}
              className="bg-rose-500 py-4 px-6 rounded-lg flex-row items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg mr-2">
                Complete Setup
              </Text>
              <Check size={20} color="white" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 p-4 min-h-screen justify-center">
        {/* Progress indicator */}
        <View className="flex-row justify-between mb-6 px-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${i <= step ? "bg-rose-500" : "bg-gray-300"} ${i === 1 || i === 5 ? "w-12" : "flex-1 mx-1"}`}
            />
          ))}
        </View>

        {renderStep()}
      </View>
    </ScrollView>
  );
}
