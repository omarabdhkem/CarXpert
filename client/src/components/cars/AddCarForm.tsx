import { useState, ChangeEvent } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { insertCarSchema } from "@shared/schema";
import { z } from "zod";
import SimpleMap from "../map/SimpleMap";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { PlusCircle, ImagePlus, Trash, Info, Car, MapPin, Camera, Loader2 } from "lucide-react";

// Car makes for dropdown
const carMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "BMW", 
  "Mercedes-Benz", "Audi", "Nissan", "Hyundai", "Kia",
  "Volkswagen", "Mazda", "Subaru", "Lexus", "Tesla"
];

// Popular car features for checkboxes
const carFeatures = [
  "Air Conditioning",
  "Power Steering",
  "Power Windows",
  "Power Locks",
  "Cruise Control",
  "AM/FM Radio",
  "Bluetooth",
  "Navigation System",
  "Backup Camera",
  "Parking Sensors",
  "Keyless Entry",
  "Push Button Start",
  "Leather Seats",
  "Heated Seats",
  "Sunroof/Moonroof",
  "Alloy Wheels",
  "Traction Control",
  "Stability Control",
  "Anti-lock Brakes (ABS)",
  "Airbags"
];

// Extend the car schema for form validation
const formSchema = insertCarSchema.extend({
  price: z.coerce.number().min(1, "Price must be at least $1"),
  year: z.coerce.number().min(1900, "Year must be at least 1900").max(new Date().getFullYear() + 1, `Year cannot be later than ${new Date().getFullYear() + 1}`),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative").optional(),
  // Add default values for arrays to prevent errors
  imageUrls: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCarForm() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [mapCoordinates, setMapCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [imageUrlsArray, setImageUrlsArray] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      color: "",
      fuelType: "",
      transmission: "",
      description: "",
      condition: "used",
      imageUrls: [],
      location: "",
      latitude: "",
      longitude: "",
      features: [],
      listingType: "regular",
    },
  });

  const addCarMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest("POST", "/api/cars", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({
        title: "Car listing created",
        description: "Your car has been successfully listed.",
      });
      setLocation("/cars");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add a car listing",
        variant: "destructive",
      });
      return;
    }

    // Add image URLs to form data
    data.imageUrls = imageUrlsArray;

    // Add map coordinates if selected
    if (mapCoordinates) {
      data.latitude = mapCoordinates.lat.toString();
      data.longitude = mapCoordinates.lng.toString();
    }

    addCarMutation.mutate(data);
  }

  const handleAddImageUrl = () => {
    if (newImageUrl && !imageUrlsArray.includes(newImageUrl)) {
      setImageUrlsArray([...imageUrlsArray, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImageUrl = (url: string) => {
    setImageUrlsArray(imageUrlsArray.filter(imageUrl => imageUrl !== url));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMapCoordinates({ lat, lng });
    form.setValue("latitude", lat.toString());
    form.setValue("longitude", lng.toString());
  };

  const nextTab = () => {
    switch (activeTab) {
      case "basic":
        setActiveTab("details");
        break;
      case "details":
        setActiveTab("photos");
        break;
      case "photos":
        setActiveTab("location");
        break;
      case "location":
        setActiveTab("preview");
        break;
      default:
        break;
    }
  };

  const prevTab = () => {
    switch (activeTab) {
      case "details":
        setActiveTab("basic");
        break;
      case "photos":
        setActiveTab("details");
        break;
      case "location":
        setActiveTab("photos");
        break;
      case "preview":
        setActiveTab("location");
        break;
      default:
        break;
    }
  };

  const isLastTab = activeTab === "preview";
  const isFirstTab = activeTab === "basic";

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="h-6 w-6 mr-2" />
            {t("cars.add.title")}
          </CardTitle>
          <CardDescription>
            Fill out the form below to list your car for sale.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="basic">{t("cars.add.basicInfo")}</TabsTrigger>
              <TabsTrigger value="details">{t("cars.add.details")}</TabsTrigger>
              <TabsTrigger value="photos">{t("cars.add.photos")}</TabsTrigger>
              <TabsTrigger value="location">{t("cars.add.location")}</TabsTrigger>
              <TabsTrigger value="preview">{t("cars.add.preview")}</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.make")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Make" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {carMakes.map((make) => (
                                <SelectItem key={make} value={make}>
                                  {make}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.model")}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Camry, Civic" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.year")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1900}
                              max={new Date().getFullYear() + 1}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.price")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={100}
                              placeholder="e.g. 25000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("search.filters.condition")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">{t("cars.conditions.new")}</SelectItem>
                              <SelectItem value="excellent">{t("cars.conditions.excellent")}</SelectItem>
                              <SelectItem value="good">{t("cars.conditions.good")}</SelectItem>
                              <SelectItem value="fair">{t("cars.conditions.fair")}</SelectItem>
                              <SelectItem value="poor">{t("cars.conditions.poor")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your car, including any special features, history, or selling points."
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.mileage")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="e.g. 35000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.color")}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Red, Blue, Silver" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fuelType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.fuelType")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Fuel Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gasoline">{t("cars.fuelTypes.gasoline")}</SelectItem>
                              <SelectItem value="diesel">{t("cars.fuelTypes.diesel")}</SelectItem>
                              <SelectItem value="electric">{t("cars.fuelTypes.electric")}</SelectItem>
                              <SelectItem value="hybrid">{t("cars.fuelTypes.hybrid")}</SelectItem>
                              <SelectItem value="plugin_hybrid">{t("cars.fuelTypes.plugin_hybrid")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="transmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cars.details.transmission")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Transmission" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="automatic">Automatic</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                              <SelectItem value="cvt">CVT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <FormLabel className="text-base">Features</FormLabel>
                    <FormDescription>
                      Select all features that your car has.
                    </FormDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                      <FormField
                        control={form.control}
                        name="features"
                        render={() => (
                          <FormItem>
                            {carFeatures.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2 mb-3">
                                <FormControl>
                                  <Checkbox
                                    checked={form.watch("features")?.includes(feature.toLowerCase())}
                                    onCheckedChange={(checked) => {
                                      const currentFeatures = form.watch("features") || [];
                                      if (checked) {
                                        form.setValue("features", [
                                          ...currentFeatures,
                                          feature.toLowerCase(),
                                        ]);
                                      } else {
                                        form.setValue(
                                          "features",
                                          currentFeatures.filter(
                                            (f) => f !== feature.toLowerCase()
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {feature}
                                </FormLabel>
                              </div>
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Photos Tab */}
                <TabsContent value="photos" className="space-y-6">
                  <div className="space-y-4">
                    <FormLabel className="text-base">Car Photos</FormLabel>
                    <FormDescription>
                      Add photos of your car. Clear, well-lit photos from multiple angles will attract more buyers.
                    </FormDescription>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Input
                          placeholder="Enter photo URL"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="flex-grow"
                        />
                        <Button type="button" onClick={handleAddImageUrl} disabled={!newImageUrl}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      
                      <FormDescription>
                        We recommend adding at least 5 photos of your car: exterior front, rear, sides, interior, and dashboard.
                      </FormDescription>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {imageUrlsArray.length > 0 ? (
                        imageUrlsArray.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Car image ${index + 1}`}
                              className="w-full h-40 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImageUrl(url)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center border-2 border-dashed rounded-md p-10 text-center">
                          <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-2">No photos added yet</p>
                          <p className="text-sm text-muted-foreground">
                            Add photo URLs to showcase your car
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" type="button">
                        <Camera className="h-4 w-4 mr-2" />
                        Tips for Great Car Photos
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Photo Tips for Selling Cars</AlertDialogTitle>
                        <AlertDialogDescription>
                          <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Clean your car thoroughly before taking photos</li>
                            <li>Take photos in good lighting, preferably during daylight</li>
                            <li>Shoot from multiple angles: front, back, sides, interior</li>
                            <li>Include close-ups of special features or upgrades</li>
                            <li>Show the odometer reading and VIN plate if possible</li>
                            <li>Take photos of any damage or wear for transparency</li>
                            <li>Use a neutral background without distractions</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Got it</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TabsContent>
                
                {/* Location Tab */}
                <TabsContent value="location" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("cars.details.location")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. New York, NY"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the city and state where your car is located.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <FormLabel className="text-base">Pin Location on Map</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" type="button">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click on the map to set your car's exact location</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="h-[400px] rounded-md overflow-hidden border">
                      <SimpleMap
                        lat={mapCoordinates?.lat || 40.7128}
                        lng={mapCoordinates?.lng || -74.0060}
                        zoom={10}
                        onClick={handleMapClick}
                        markers={mapCoordinates ? [mapCoordinates] : []}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {mapCoordinates
                          ? `Selected location: ${mapCoordinates.lat.toFixed(6)}, ${mapCoordinates.lng.toFixed(6)}`
                          : "No location selected"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Preview Tab */}
                <TabsContent value="preview" className="space-y-6">
                  <div className="p-6 border rounded-md space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {form.watch("year")} {form.watch("make")} {form.watch("model")}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{form.watch("location") || "Location not set"}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">
                          ${form.watch("price") ? form.watch("price").toLocaleString() : "0"}
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {imageUrlsArray.length > 0 ? (
                      <div className="aspect-video rounded-md overflow-hidden">
                        <img
                          src={imageUrlsArray[0]}
                          alt="Primary car image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-md flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No photos added</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground">Condition</p>
                        <p className="font-medium">{form.watch("condition") || "Not specified"}</p>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground">Mileage</p>
                        <p className="font-medium">{form.watch("mileage") ? `${form.watch("mileage").toLocaleString()} mi` : "Not specified"}</p>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground">Transmission</p>
                        <p className="font-medium">{form.watch("transmission") || "Not specified"}</p>
                      </div>
                      <div className="border rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                        <p className="font-medium">{form.watch("fuelType") || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {form.watch("description") || "No description provided."}
                      </p>
                    </div>
                    
                    {form.watch("features") && form.watch("features").length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Features</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {form.watch("features").map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <PlusCircle className="h-4 w-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                    <h4 className="flex items-center gap-2 font-medium text-yellow-800 dark:text-yellow-300">
                      <Info className="h-4 w-4" />
                      Before submitting
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300/80 mt-1">
                      Please review all details carefully. Once submitted, your listing will be visible to potential buyers.
                    </p>
                  </div>
                </TabsContent>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={isFirstTab}
                  >
                    {t("common.previous")}
                  </Button>
                  
                  {isLastTab ? (
                    <Button 
                      type="submit" 
                      disabled={addCarMutation.isPending}
                      className="gap-2"
                    >
                      {addCarMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {t("cars.add.submit")}
                    </Button>
                  ) : (
                    <Button type="button" onClick={nextTab}>
                      {t("common.next")}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
