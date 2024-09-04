// _layout.tsx
import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack>
      {/* Default route for the home page */}

      {/* Other routes */}
      <Stack.Screen
        name="auth/login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
