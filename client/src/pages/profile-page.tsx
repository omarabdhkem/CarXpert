import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Car, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/shared/Layout";
import CarCard from "@/components/cars/CarCard";
import { Link } from "wouter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  UserCircle,
  Car as CarIcon,
  Heart,
  Settings,
  Mail,
  Phone,
  BarChart3,
  Loader2,
  Send,
  Key,
  Trash,
  LogOut,
} from "lucide-react";

// Update profile schema
const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  
  // Profile update form
  const updateProfileForm = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });
  
  // Change password form
  const changePasswordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Fetch user's cars
  const { data: userCars, isLoading: isLoadingCars } = useQuery<Car[]>({
    queryKey: ["/api/cars", { userId: user?.id }],
    enabled: !!user,
  });
  
  // Fetch user's favorites
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery<Car[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });
  
  // Fetch user's comparisons
  const { data: comparisons, isLoading: isLoadingComparisons } = useQuery<any[]>({
    queryKey: ["/api/comparisons"],
    enabled: !!user,
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileValues) => {
      return await apiRequest("PATCH", `/api/users/${user?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordValues) => {
      return await apiRequest("POST", `/api/users/${user?.id}/change-password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been successfully changed.",
      });
      changePasswordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error changing password",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/users/${user?.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      logoutMutation.mutate();
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting account",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle profile update
  function onUpdateProfileSubmit(data: UpdateProfileValues) {
    updateProfileMutation.mutate(data);
  }
  
  // Handle password change
  function onChangePasswordSubmit(data: ChangePasswordValues) {
    changePasswordMutation.mutate(data);
  }
  
  // Handle account deletion
  function handleDeleteAccount() {
    deleteAccountMutation.mutate();
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-lg mb-4">You need to be logged in to view this page.</p>
          <Button asChild>
            <Link href="/auth">Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("profile.title")}</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account, listings, and saved items
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <Card className="md:w-1/4 h-fit">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback className="text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-center">{user.fullName || user.username}</CardTitle>
              <CardDescription className="text-center">{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                <TabsList className="flex flex-col h-full gap-2">
                  <TabsTrigger value="personal" className="justify-start">
                    <UserCircle className="h-4 w-4 mr-2" />
                    {t("profile.personalInfo")}
                  </TabsTrigger>
                  <TabsTrigger value="cars" className="justify-start">
                    <CarIcon className="h-4 w-4 mr-2" />
                    {t("profile.myCars")}
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    {t("profile.favorites")}
                  </TabsTrigger>
                  <TabsTrigger value="comparisons" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t("profile.comparisons")}
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    {t("profile.settings")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-full" onClick={() => logoutMutation.mutate()}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("nav.logout")}
              </Button>
            </CardFooter>
          </Card>

          {/* Content Area */}
          <div className="flex-1">
            <TabsContent value="personal" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.personalInfo")}</CardTitle>
                  <CardDescription>
                    Manage your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...updateProfileForm}>
                    <form onSubmit={updateProfileForm.handleSubmit(onUpdateProfileSubmit)} className="space-y-6">
                      <FormField
                        control={updateProfileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.register.fullName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={updateProfileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.register.email")}</FormLabel>
                              <div className="flex items-center">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                {user.isVerified ? (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">Verified</span>
                                ) : (
                                  <Button variant="outline" size="sm" className="ml-2">
                                    <Send className="h-3 w-3 mr-1" />
                                    Verify
                                  </Button>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={updateProfileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.register.phone")}</FormLabel>
                              <div className="flex items-center">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <Button variant="outline" size="sm" className="ml-2">
                                  <Send className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={updateProfileForm.control}
                        name="avatarUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Picture URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a URL for your profile picture
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t("profile.editProfile")}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cars" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.myCars")}</CardTitle>
                  <CardDescription>
                    Manage your car listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Button asChild>
                      <Link href="/add-car">
                        <CarIcon className="h-4 w-4 mr-2" />
                        {t("nav.addCar")}
                      </Link>
                    </Button>
                  </div>

                  {isLoadingCars ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : userCars && userCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userCars.map((car) => (
                        <CarCard key={car.id} car={car} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <CarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No cars listed yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't listed any cars for sale. Start selling now!
                      </p>
                      <Button asChild>
                        <Link href="/add-car">
                          {t("nav.addCar")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.favorites")}</CardTitle>
                  <CardDescription>
                    Cars you've saved to your favorites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingFavorites ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((car) => (
                        <CarCard key={car.id} car={car} isFavorite={true} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't added any cars to your favorites.
                      </p>
                      <Button asChild>
                        <Link href="/cars">
                          Browse Cars
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparisons" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.comparisons")}</CardTitle>
                  <CardDescription>
                    Your saved car comparisons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingComparisons ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : comparisons && comparisons.length > 0 ? (
                    <div className="space-y-4">
                      {comparisons.map((comparison) => (
                        <div key={comparison.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Comparison #{comparison.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(comparison.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 mb-4">
                            {comparison.carIds.map((carId: number) => (
                              <Badge key={carId} variant="outline">{carId}</Badge>
                            ))}
                          </div>
                          <Button asChild size="sm">
                            <Link href={`/compare?id=${comparison.id}`}>
                              View Comparison
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No comparisons yet</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't saved any car comparisons.
                      </p>
                      <Button asChild>
                        <Link href="/compare">
                          Compare Cars
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profile.settings")}</CardTitle>
                  <CardDescription>
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Email Verification */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      {t("profile.verifyEmail")}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {user.isVerified
                            ? "Your email has been verified."
                            : "Verify your email to secure your account."}
                        </p>
                        <p className="text-sm">{user.email}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        disabled={user.isVerified}
                      >
                        {user.isVerified ? "Verified" : "Send Verification"}
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Phone Verification */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      {t("profile.verifyPhone")}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Verify your phone number for additional security.
                        </p>
                        <p className="text-sm">{user.phone || "No phone number added"}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        disabled={!user.phone}
                      >
                        Verify Phone
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Change Password */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      {t("profile.changePassword")}
                    </h3>
                    <Form {...changePasswordForm}>
                      <form onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)} className="space-y-4">
                        <FormField
                          control={changePasswordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={changePasswordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={changePasswordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Change Password
                        </Button>
                      </form>
                    </Form>
                  </div>
                  
                  <Separator />
                  
                  {/* Delete Account */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center text-destructive">
                      <Trash className="h-5 w-5 mr-2" />
                      {t("profile.deleteAccount")}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground"
                          >
                            {deleteAccountMutation.isPending && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </div>
    </Layout>
  );
}
