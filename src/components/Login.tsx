import { useState } from "react";
import { Input, Button, Card } from "@nextui-org/react";
import { isTokenValid, setAuthToken } from "../services/api";

export const Login = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (token) {
      const isValid = await isTokenValid(token);
      if (!isValid) {
        setError("Invalid token! Please check your token or Create a new one.");
        return;
      }
      setAuthToken(token);
      localStorage.setItem("jupyterhub-token", token); // Save token to local storage
      window.location.reload(); // Refresh to update the authentication state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-800 to-gray-900">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">JupyterHub Authentication</h1>
        <div className="space-y-4">
          <Input
            label="JupyterHub Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type="password"
            placeholder="Enter your JupyterHub token"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            color="primary"
            className="w-full"
            onPress={handleLogin}
            disabled={!token}
          >
            Connect to JupyterHub
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            To get your token:
            <ol className="list-decimal list-inside mt-2">
              <li>
                Go to JupyterHub at{" "}
                <a
                  className="text-green-400"
                  href="http://localhost:8000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  http://localhost:8000
                </a>
              </li>
              <li>Log in with your credentials</li>
              <li>Navigate to Token page</li>
              <li>Generate a new token</li>
            </ol>
          </p>
        </div>
      </Card>
    </div>
  );
};
