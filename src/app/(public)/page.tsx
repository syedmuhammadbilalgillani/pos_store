"use client";

import { fetchStoreData, Login } from "@/api/apiFuntions";
import TranslatedText from "@/components/Language/TranslatedText";
import { useTenantStore } from "@/stores/tenantStore";
import { useUserStore } from "@/stores/userStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LoginFormSchema {
  email: string;
  passwordHash: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<Partial<LoginFormSchema>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const setTenant = useTenantStore((state) => state.setTenant);
  // const user = useUserStore((state) => state.user);
  // const tenant = useTenantStore((state) => state.tenant);

  const router = useRouter();

  const handleChange = (key: keyof LoginFormSchema, value: string) => {
    setFormData({ ...formData, [key]: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await Login(formData);

      if (result.success) {
        // Store tokens in cookies
        Cookies.set("accessToken", result.accessToken, {
          secure: true,
          sameSite: "Strict",
        });
        // Store user data in Zustand store
        setUser(result.data.user);
        const data = await fetchStoreData();
        setTenant(data[0]);
        // console.log("data for store", data);
        toast.success("Login Successful");
        router.push("/dashboard");
      } else {
        // Handle unsuccessful login
        toast.error(result.message || "Login failed. Please try again.");
        // console.error("Login Error:", result.message);
      }
    } catch (error: any) {
      // This catch block is for any unexpected errors in the Login function itself
      toast.error("An unexpected error occurred. Please try again.");
      // console.error("Unexpected Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log("user Data:", user);
  // console.log("tenant Data:", tenant);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#15181E] p-6 shadow-lg rounded-md w-96"
        aria-label="Login Form"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Login
        </h2>

        {["email", "passwordHash"].map((key) => (
          <div key={key} className="mb-4">
            <label
              className="block font-medium text-gray-900 dark:text-gray-300"
              htmlFor={key}
            >
              <TranslatedText
                textKey={key === "email" ? "email" : "password"}
              />
            </label>
            <input
              id={key}
              type={key === "passwordHash" ? "password" : "email"}
              value={formData[key as keyof LoginFormSchema] || ""}
              onChange={(e) =>
                handleChange(key as keyof LoginFormSchema, e.target.value)
              }
              className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              required
              autoComplete={key}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
