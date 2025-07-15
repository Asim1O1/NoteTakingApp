import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../stores";

export default function Login() {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types (fixed null check)
    if (errors && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear form error
    setErrors((prev) => ({ ...prev, form: "" }));

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData);
      console.log("Login result:", result);
    } catch (err) {
      console.error("Login error:", err);

      // Better error handling
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";

      toast.error(errorMessage, {
        id: "login",
      });

      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center">
      <Card className="w-full m-auto max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {/* Show form-level error */}
              {errors.form && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errors.form}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  required
                  onChange={handleChange}
                  disabled={isLoading}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <CardDescription className="flex items-center mt-4">
            Don't have an account?
            <Button type="button" variant="link">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
