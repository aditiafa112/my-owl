import React, { useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formError, setFormError] = useState({
    email: "",
    password: "",
    form: "",
  });

  const isValidEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const isFormValid = useMemo(() => {
    return email.length > 0 && password.length > 0;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("hello");
      setFormError({ email: "", password: "", form: "" });

      if (!isValidEmail(email)) {
        setFormError((e) => ({
          ...e,
          email: "Please enter a valid email address.",
        }));
        return;
      }

      if (password === "") {
        setFormError((e) => ({
          ...e,
          password: "Password should not be empty.",
        }));
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post("https://www.sample.app/login", {
          email,
          password,
        });
        // Handle response as needed
        console.log("Login successful:", response.data);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response) {
          setFormError((e) => ({
            ...e,
            form: `Login failed: ${axiosError.response?.data.message}`,
          }));
        } else if (axiosError.request) {
          setFormError((e) => ({
            ...e,
            form: "Login failed: No response from server",
          }));
        } else {
          setFormError((e) => ({
            ...e,
            form: `Login failed: ${axiosError.message}`,
          }));
        }

        setFormError((e) => ({
          ...e,
          form: "Login failed, something when wrong!!!",
          axiosError,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, isValidEmail]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl text-center font-semibold mb-8">Login</h1>
          <div className="mb-4">
            <label className="text-xl block font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <span className="block text-red-500 mt-2">{formError.email}</span>
          </div>
          <div className="mb-6">
            <label className="text-xl block font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <span className="block text-red-500 mt-2">
              {formError.password}
            </span>
          </div>
          <button
            disabled={isLoading || !isFormValid}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading ..." : "Login"}
          </button>
          <span className="block text-red-500 mt-2">{formError.form}</span>
        </form>
      </div>
    </div>
  );
};

export default App;
