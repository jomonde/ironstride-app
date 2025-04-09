import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import OnboardingFlow from "./components/OnboardingFlow";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarding_completed");
        if (value === null) {
          // First time user
          setIsFirstLaunch(true);
        } else {
          // Returning user
          setIsFirstLaunch(false);
          router.replace("/tabs");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Default to showing onboarding if there's an error
        setIsFirstLaunch(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async (userData: any) => {
    try {
      // Save user data
      await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
      // Mark onboarding as completed
      await AsyncStorage.setItem("@onboarding_completed", "true");
      // Navigate to main app
      router.replace("/tabs");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  // Show loading screen while checking status
  if (isFirstLaunch === null) {
    return <View className="flex-1 bg-white" />;
  }

  // Show onboarding for first time users
  if (isFirstLaunch) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // This should not be visible as we redirect to tabs
  return <View className="flex-1 bg-white" />;
}
