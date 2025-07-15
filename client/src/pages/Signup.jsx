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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../stores/index";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    form: "",
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { register, isLoading } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ ...errors, form: "" });

    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        fullname: formData.fullName,
        email: formData.email.toLowerCase(),
        password: formData.password,
      });
      console.log("Registration result:", result);
      setRegistrationSuccess(true);
      setRegisteredEmail(formData.email.toLowerCase());

      toast.success("Account created successfully! Redirecting...", {
        id: "register",
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again.",
        {
          id: "register",
        }
      );
      setErrors((prev) => ({
        ...prev,
        form: err.message || "Registration failed. Please try again.",
      }));
    }
  };

  // Show success message after registration
  if (registrationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-green-600">
              🎉 Registration Successful!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p>We've sent a verification email to:</p>
            <p className="font-semibold text-blue-600">{registeredEmail}</p>
            <p>
              Please check your email and click the verification link to
              activate your account.
            </p>

            <div className="bg-gray-50 p-4 rounded-md text-sm">
              <p className="font-medium mb-2">Didn't receive the email?</p>
              <ul className="text-left space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Wait a few minutes for delivery</li>
                <li>• Make sure the email address is correct</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.open("/api/auth/resend-verification", "_blank")
              }
            >
              Resend Verification Email
            </Button>

            <Button variant="link" asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
        </CardHeader>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            {errors.form && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                {errors.form}
              </div>
            )}

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </CardFooter>
        </form>

        <CardFooter className="flex-col gap-2">
          <CardDescription className="flex items-center mt-4 justify-center">
            Already have an account?
            <Button variant="link" className="px-2" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
