module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    "@realm/babel-plugin",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@": "./src",
        },
      },
    ],
    "react-native-reanimated/plugin", // Must always be the last plugin
  ],
};
