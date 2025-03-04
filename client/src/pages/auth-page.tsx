import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Layout from "@/components/shared/Layout";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, Car, Check } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration form schema - using the base schema from the shared schema
const registerSchema = insertUserSchema;

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { t } = useTranslation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Set active tab based on URL query param
  useEffect(() => {
    const params = new URLSearchParams(search);
    const action = params.get("action");
    if (action === "register") {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, [search]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Initialize login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Initialize register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      fullName: "",
    },
  });

  // Handle login submission
  function onLoginSubmit(data: LoginValues) {
    loginMutation.mutate(data);
  }

  // Handle registration submission
  function onRegisterSubmit(data: RegisterValues) {
    registerMutation.mutate(data);
  }

  // Toggle between login and register tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLocation(`/auth?action=${value}`);
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Auth Form Section */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">{t("app.name")}</span>
              </div>
              <CardTitle className="text-2xl">
                {activeTab === "login" ? t("auth.login.title") : t("auth.register.title")}
              </CardTitle>
              <CardDescription>
                {activeTab === "login"
                  ? "Enter your credentials to access your account"
                  : "Create an account to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">{t("auth.login.title")}</TabsTrigger>
                  <TabsTrigger value="register">{t("auth.register.title")}</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.login.username")}</FormLabel>
                            <FormControl>
                              <Input placeholder="username@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>{t("auth.login.password")}</FormLabel>
                              <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                                {t("auth.login.forgotPassword")}
                              </Link>
                            </div>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {t("auth.login.loginButton")}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          {t("auth.login.orContinue")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <Button variant="outline" disabled>
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                      <Button variant="outline" disabled>
                        <FaFacebook className="mr-2 h-4 w-4" />
                        Facebook
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.register.username")}</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.register.email")}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.register.password")}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.register.phone")}</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (234) 567-8900" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.register.fullName")}</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("auth.register.termsAndConditions")}
                        </label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {t("auth.register.signupButton")}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-6">
              <div className="text-sm text-center text-muted-foreground">
                {activeTab === "login" ? (
                  <span>
                    {t("auth.login.noAccount")}{" "}
                    <Button variant="link" className="px-0" onClick={() => handleTabChange("register")}>
                      {t("auth.login.signup")}
                    </Button>
                  </span>
                ) : (
                  <span>
                    {t("auth.register.haveAccount")}{" "}
                    <Button variant="link" className="px-0" onClick={() => handleTabChange("login")}>
                      {t("auth.register.login")}
                    </Button>
                  </span>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Hero Section */}
        <div className="bg-primary hidden md:flex md:w-1/2 flex-col items-center justify-center text-white p-10 relative">
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }} />
          
          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-bold mb-6">{t("app.name")}</h1>
            <p className="text-xl mb-8">{t("app.tagline")}</p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p>Find your dream car from thousands of listings</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p>Connect with trusted sellers and dealers</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p>Compare cars side by side to make the best choice</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-1 mt-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p>Sell your car quickly with our powerful platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
