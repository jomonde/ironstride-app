const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

// Get the default Expo configuration
const config = getDefaultConfig(__dirname);

// Define tempobook directories
const tempoDir = path.resolve(__dirname, "app/tempobook");
const tempoDynamicDir = path.resolve(__dirname, "app/tempobook/dynamic");
const tempoStoryboardsDir = path.resolve(
  __dirname,
  "app/tempobook/storyboards",
);

// Create directories if they don't exist
if (!fs.existsSync(tempoDir)) {
  fs.mkdirSync(tempoDir, { recursive: true });
}
if (!fs.existsSync(tempoDynamicDir)) {
  fs.mkdirSync(tempoDynamicDir, { recursive: true });
}
if (!fs.existsSync(tempoStoryboardsDir)) {
  fs.mkdirSync(tempoStoryboardsDir, { recursive: true });
}

// Add tempobook directories to watchFolders
config.watchFolders = [
  ...(config.watchFolders || []),
  tempoDir,
  tempoDynamicDir,
  tempoStoryboardsDir,
];

// Explicitly block any references to app-annotated
config.resolver = {
  ...config.resolver,
  blockList: [
    /\.git\/.*/, // Block git files
    /app-annotated/, // Block any references to app-annotated
  ],
};

// Export the configuration with NativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
