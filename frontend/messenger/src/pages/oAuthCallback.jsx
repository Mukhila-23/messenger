import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OAuthCallback() {
const navigate = useNavigate();
const [error, setError] = useState("");

useEffect(() => {
const handleGoogleCallback = () => {
// Step 1: Read the current URL
const currentUrl = window.location.href;
const params = new URLSearchParams(window.location.search);

  const token = params.get("token");
  const userData = params.get("user");

  // Step 2: Debugging information
  console.log("Current callback URL:", currentUrl);
  console.log("Received token:", token ? "[TOKEN RECEIVED]" : null);
  console.log("Received user:", userData);

  try {
    // Step 3: Check whether the backend returned the required information
    if (!token || !userData) {
      throw new Error(
        "Google login did not return the required token or user information."
      );
    }

    // Step 4: Convert the user data from JSON string to an object
    const user = JSON.parse(userData);

    // Step 5: Validate the user information
    if (!user || !user.id || !user.email || !user.role) {
      throw new Error("The returned user information is incomplete.");
    }

    // Step 6: Save the token and user information
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("Google login successful.");
    console.log("User role:", user.role);

    // Step 7: Navigate according to the user's role
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  } catch (err) {
    console.error("Google login callback error:", err);
    setError(err.message || "Google login failed. Please try again.");
  }
};

handleGoogleCallback();


}, [navigate]);

if (error) {
return ( <div role="alert"> <h2>Google Login Failed</h2> <p>{error}</p>
<button onClick={() => navigate("/login", { replace: true })}>
Back to Login </button> </div>
);
}

return ( <div> <p>Google login successful. Redirecting to your dashboard...</p> </div>
);
}

export default OAuthCallback;
