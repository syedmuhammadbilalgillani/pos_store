"use client";

import { fetchStoreData, Login } from "@/api/apiFuntions";
import TranslatedText from "@/components/Language/TranslatedText";
import { useTenantStore } from "@/stores/tenantStore";
import { useUserStore } from "@/stores/userStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LoginFormSchema {
  email: string;
  passwordHash: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<Partial<LoginFormSchema>>({});
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const setTenant = useTenantStore((state) => state.setTenant);
  const router = useRouter();

  const handleChange = (key: keyof LoginFormSchema, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const result = await Login(formData);
  
      if (result.success) {
        // Set accessToken cookie
        Cookies.set("accessToken", result.accessToken, {
          secure: true,
          sameSite: "Strict",
        });
  
     
        setUser(result.data.user);
  
        const data = await fetchStoreData();
        setTenant(data[0]);
  
        toast.success("Login Successful");
        router.push("/dashboard");
      } else {
        toast.error(
          typeof result.message === "string"
            ? result.message
            : result.message?.message || "Login failed. Please try again."
        );
      }
    } catch (error: any) {
      toast.error(
        `An unexpected error occurred. Please try again. ${
          error.message || ""
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} aria-label="Login Form">
            {["email", "passwordHash"].map((key) => (
              <div key={key} className="mb-4">
                <Label htmlFor={key} className="block mb-1">
                  <TranslatedText
                    textKey={key === "email" ? "email" : "password"}
                  />
                </Label>
                <Input
                  id={key}
                  type={key === "passwordHash" ? "password" : "email"}
                  value={formData[key as keyof LoginFormSchema] || ""}
                  onChange={(e) =>
                    handleChange(key as keyof LoginFormSchema, e.target.value)
                  }
                  autoComplete={key}
                  required
                />
              </div>
            ))}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
