import { Tabs } from "expo-router";
import { BarChart2, Heart, Dumbbell } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f43f5e",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="strength"
        options={{
          title: "Strength",
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
