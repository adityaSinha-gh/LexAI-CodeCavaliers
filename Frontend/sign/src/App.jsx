import React from "react";
import { AuthProvider } from "./AuthContext.jsx";
import SignupPage from "./SignupPage.jsx";

/**
 * If your project already has routing (react-router, etc.) and an existing
 * AuthProvider, drop <SignupPage /> into your /signup route inside your
 * existing provider instead of this demo App shell.
 */
export default function App() {
  return (
    <AuthProvider>
      <SignupPage
        onSignupSuccess={(data) => {
          // Replace with your router's redirect, e.g. navigate("/app")
          console.log("Signed up:", data);
        }}
      />
    </AuthProvider>
  );
}
