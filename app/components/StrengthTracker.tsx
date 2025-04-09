import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Dumbbell,
  User,
  Barbell,
  Building2,
  Plus,
  Minus,
  Save,
  Clock,
  CheckCircle,
} from "lucide-react-native";
import { supabase } from "../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  rpe: number;
  notes: string;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  type: WorkoutType;
  exercises: Exercise[];
}

type WorkoutType = "bodyweight" | "kettlebell" | "barbell" | "machine";

function StrengthTracker() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkoutTemplate | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sample workout templates
  const workoutTemplates: WorkoutTemplate[] = [
    {
      id: "1",
      name: "Basic Push Workout",
      type: "bodyweight",
      exercises: [
        {
          id: "1",
          name: "Push-ups",
          sets: 3,
          reps: 10,
          weight: 0,
          rpe: 7,
          notes: "",
        },
        {
          id: "2",
          name: "Dips",
          sets: 3,
          reps: 8,
          weight: 0,
          rpe: 8,
          notes: "",
        },
        {
          id: "3",
          name: "Pike Push-ups",
          sets: 3,
          reps: 12,
          weight: 0,
          rpe: 6,
          notes: "",
        },
      ],
    },
    {
      id: "2",
      name: "Kettlebell Basics",
      type: "kettlebell",
      exercises: [
        {
          id: "1",
          name: "Kettlebell Swings",
          sets: 4,
          reps: 15,
          weight: 16,
          rpe: 7,
          notes: "",
        },
        {
          id: "2",
          name: "Goblet Squats",
          sets: 3,
          reps: 10,
          weight: 16,
          rpe: 6,
          notes: "",
        },
        {
          id: "3",
          name: "Turkish Get-ups",
          sets: 2,
          reps: 3,
          weight: 12,
          rpe: 8,
          notes: "",
        },
      ],
    },
  ];

  const handleSelectWorkoutType = (type: WorkoutType) => {
    setWorkoutType(type);
    setShowTemplates(true);
  };

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    setSelectedTemplate(template);
    setExercises([...template.exercises]);
    setShowTemplates(false);
  };

  const handleCreateCustomWorkout = () => {
    setSelectedTemplate(null);
    setExercises([
      {
        id: Date.now().toString(),
        name: "",
        sets: 3,
        reps: 10,
        weight: 0,
        rpe: 7,
        notes: "",
      },
    ]);
    setShowTemplates(false);
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        name: "",
        sets: 3,
        reps: 10,
        weight: 0,
        rpe: 7,
        notes: "",
      },
    ]);
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const handleUpdateExercise = (
    id: string,
    field: keyof Exercise,
    value: any,
  ) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === id) {
          return { ...exercise, [field]: value };
        }
        return exercise;
      }),
    );
  };

  // Get user ID on component mount
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user_data");
        if (userData) {
          // For now, we'll use a placeholder ID since we don't have real auth
          // In a real app, you'd get this from the auth system
          setUserId("user-" + JSON.parse(userData).age);
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    };

    getUserId();
  }, []);

  // Handle timer for workout duration
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleSaveWorkout = async () => {
    if (!workoutType) {
      Alert.alert("Error", "Please select a workout type");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise");
      return;
    }

    // Check if any exercise is missing a name
    const hasInvalidExercises = exercises.some((ex) => !ex.name.trim());
    if (hasInvalidExercises) {
      Alert.alert("Error", "Please provide a name for all exercises");
      return;
    }

    // Calculate total volume (weight * sets * reps)
    const totalVolume = exercises.reduce((sum, exercise) => {
      return sum + exercise.weight * exercise.sets * exercise.reps;
    }, 0);

    setIsSaving(true);

    try {
      // Create a workout object to save
      const workoutData = {
        user_id: userId,
        type: workoutType,
        exercises: exercises,
        total_volume: totalVolume,
        duration: duration,
        notes: notes,
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from("strength_activities")
        .insert(workoutData);

      if (error) {
        console.error("Error saving workout:", error);
        Alert.alert("Error", "Failed to save workout. Please try again.");
      } else {
        console.log("Workout saved successfully:", data);
        setSaveSuccess(true);

        // Reset form after successful save
        setTimeout(() => {
          setWorkoutType(null);
          setSelectedTemplate(null);
          setExercises([]);
          setDuration(0);
          setTimerActive(false);
          setNotes("");
        }, 1500);
      }
    } catch (error) {
      console.error("Exception saving workout:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderWorkoutTypeSelection = () => (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Select Workout Type</Text>
      <View className="space-y-3">
        <TouchableOpacity
          onPress={() => handleSelectWorkoutType("bodyweight")}
          className="flex-row items-center p-4 bg-gray-100 rounded-lg"
        >
          <User size={24} color="#f43f5e" />
          <Text className="ml-3 text-lg">Bodyweight</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectWorkoutType("kettlebell")}
          className="flex-row items-center p-4 bg-gray-100 rounded-lg"
        >
          <Dumbbell size={24} color="#f43f5e" />
          <Text className="ml-3 text-lg">Kettlebell / Dumbbell</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectWorkoutType("barbell")}
          className="flex-row items-center p-4 bg-gray-100 rounded-lg"
        >
          <Barbell size={24} color="#f43f5e" />
          <Text className="ml-3 text-lg">Barbell / Free Weight</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectWorkoutType("machine")}
          className="flex-row items-center p-4 bg-gray-100 rounded-lg"
        >
          <Building2 size={24} color="#f43f5e" />
          <Text className="ml-3 text-lg">Machine / Gym</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTemplateSelection = () => (
    <View className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Select Workout</Text>
        <TouchableOpacity onPress={() => setWorkoutType(null)}>
          <Text className="text-rose-500">Back</Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-3 mb-4">
        {workoutTemplates
          .filter((template) => template.type === workoutType)
          .map((template) => (
            <TouchableOpacity
              key={template.id}
              onPress={() => handleSelectTemplate(template)}
              className="p-4 bg-gray-100 rounded-lg"
            >
              <Text className="text-lg font-medium">{template.name}</Text>
              <Text className="text-gray-500">
                {template.exercises.length} exercises
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <TouchableOpacity
        onPress={handleCreateCustomWorkout}
        className="p-4 bg-rose-100 rounded-lg flex-row justify-center items-center"
      >
        <Plus size={20} color="#f43f5e" />
        <Text className="ml-2 text-lg font-medium text-rose-500">
          Create Custom Workout
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderExerciseForm = () => (
    <ScrollView className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">
          {selectedTemplate ? selectedTemplate.name : "Custom Workout"}
        </Text>
        <TouchableOpacity onPress={() => setShowTemplates(true)}>
          <Text className="text-rose-500">Change</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise List */}
      <View className="space-y-4 mb-6">
        {exercises.map((exercise, index) => (
          <View key={exercise.id} className="bg-gray-50 p-4 rounded-lg">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-lg">Exercise {index + 1}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveExercise(exercise.id)}
              >
                <Minus size={20} color="#f43f5e" />
              </TouchableOpacity>
            </View>

            <View className="mb-3">
              <Text className="text-gray-600 mb-1">Exercise Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2"
                value={exercise.name}
                onChangeText={(text) =>
                  handleUpdateExercise(exercise.id, "name", text)
                }
                placeholder="e.g., Bench Press"
              />
            </View>

            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600 mb-1">Sets</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={exercise.sets.toString()}
                  onChangeText={(text) =>
                    handleUpdateExercise(
                      exercise.id,
                      "sets",
                      parseInt(text) || 0,
                    )
                  }
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-600 mb-1">Reps</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={exercise.reps.toString()}
                  onChangeText={(text) =>
                    handleUpdateExercise(
                      exercise.id,
                      "reps",
                      parseInt(text) || 0,
                    )
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-gray-600 mb-1">Weight (kg)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={exercise.weight.toString()}
                  onChangeText={(text) =>
                    handleUpdateExercise(
                      exercise.id,
                      "weight",
                      parseFloat(text) || 0,
                    )
                  }
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-gray-600 mb-1">RPE (1-10)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={exercise.rpe.toString()}
                  onChangeText={(text) => {
                    const rpe = parseInt(text) || 0;
                    handleUpdateExercise(
                      exercise.id,
                      "rpe",
                      Math.min(10, Math.max(1, rpe)),
                    );
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Notes (optional)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-2"
                value={exercise.notes}
                onChangeText={(text) =>
                  handleUpdateExercise(exercise.id, "notes", text)
                }
                placeholder="e.g., 3 sec eccentric"
                multiline
              />
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleAddExercise}
        className="mb-6 p-3 border border-rose-300 rounded-lg flex-row justify-center items-center"
      >
        <Plus size={20} color="#f43f5e" />
        <Text className="ml-2 text-rose-500 font-medium">Add Exercise</Text>
      </TouchableOpacity>

      {/* Workout Notes */}
      <View className="mb-6">
        <Text className="font-bold text-lg mb-2">Workout Notes</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any notes about this workout..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Timer */}
      <View className="mb-6">
        <Text className="font-bold text-lg mb-2">Workout Duration</Text>
        <View className="flex-row items-center">
          <Clock size={24} color="#f43f5e" className="mr-2" />
          <Text className="text-xl">
            {Math.floor(duration / 60)}:
            {(duration % 60).toString().padStart(2, "0")}
          </Text>
          <TouchableOpacity
            onPress={() => setTimerActive(!timerActive)}
            className="ml-4 bg-rose-100 px-4 py-2 rounded-lg"
          >
            <Text className="text-rose-500 font-medium">
              {timerActive ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      {saveSuccess ? (
        <View className="bg-green-500 p-4 rounded-lg flex-row justify-center items-center mb-10">
          <CheckCircle size={20} color="white" />
          <Text className="ml-2 text-white font-bold text-lg">
            Workout Saved!
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleSaveWorkout}
          disabled={isSaving}
          className={`${isSaving ? "bg-gray-400" : "bg-rose-500"} p-4 rounded-lg flex-row justify-center items-center mb-10`}
        >
          {isSaving ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text className="ml-2 text-white font-bold text-lg">
                Saving...
              </Text>
            </>
          ) : (
            <>
              <Save size={20} color="white" />
              <Text className="ml-2 text-white font-bold text-lg">
                Save Workout
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  // Main render logic
  if (!workoutType) {
    return renderWorkoutTypeSelection();
  }

  if (showTemplates) {
    return renderTemplateSelection();
  }

  return renderExerciseForm();
}

// Set displayName explicitly
StrengthTracker.displayName = "StrengthTracker";
export default StrengthTracker;
