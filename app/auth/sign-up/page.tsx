"use client";

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
import Image from "next/image";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import { signUp } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden border-none shadow-xl dark:bg-slate-950/90 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <CardHeader className="space-y-1 pb-6 pt-6">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your information to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className="h-11 rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className="h-11 rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="h-11 rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="h-11 pr-10 rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-muted-foreground" />
                  ) : (
                    <Eye size={16} className="text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password_confirmation"
                className="text-sm font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="h-11 pr-10 rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="text-muted-foreground" />
                  ) : (
                    <Eye size={16} className="text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Profile Image (optional)
              </Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-blue-500 shadow-sm">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                )}

                <div className="flex-1">
                  <div className="relative flex items-center">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer rounded-md border-slate-200 bg-white/50 dark:bg-slate-800/50 dark:border-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                    />
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full p-0"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <X size={16} className="text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or GIF, max 2MB
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg mt-2"
              disabled={loading}
              onClick={async () => {
                await signUp.email({
                  email,
                  password,
                  name: `${firstName} ${lastName}`,
                  image: image ? await convertImageToBase64(image) : "",
                  callbackURL: "/sign-in",
                  fetchOptions: {
                    onResponse: () => {
                      setLoading(false);
                    },
                    onRequest: () => {
                      setLoading(true);
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                    },
                    onSuccess: async () => {
                      router.push("sign-in");
                      toast.success("Account created successfully!");
                    },
                  },
                });
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create account"
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col items-center pb-6 pt-0">
            <div className="relative my-4 w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-slate-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <a href="/auth/sign-in">Sign in</a>
            </Button>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a
                href="/terms"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </a>
            </div>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Secured by{" "}
              <span className="text-orange-400 font-medium">better-auth.</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
