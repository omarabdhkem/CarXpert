import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Car, CarComparison } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { X, Plus, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Specifications to compare
const specCategories = {
  basic: [
    { key: "make", label: "Make" },
    { key: "model", label: "Model" },
    { key: "year", label: "Year" },
    { key: "price", label: "Price", format: (val: number) => `$${val.toLocaleString()}` },
    { key: "condition", label: "Condition" },
  ],
  details: [
    { key: "mileage", label: "Mileage", format: (val: number) => `${val?.toLocaleString() || 'N/A'} mi` },
    { key: "color", label: "Color" },
    { key: "fuelType", label: "Fuel Type" },
    { key: "transmission", label: "Transmission" },
  ],
  location: [
    { key: "location", label: "Location" },
  ]
};

// Features to compare (these would be checked against car.features array)
const featureCategories = [
  "Bluetooth",
  "Navigation",
  "Leather Seats",
  "Sunroof",
  "Backup Camera",
  "Heated Seats",
  "Third Row Seating",
  "Apple CarPlay",
  "Android Auto",
  "Keyless Entry",
  "Remote Start",
  "Adaptive Cruise Control",
  "Blind Spot Monitoring"
];

interface CarCompareProps {
  initialCars?: Car[];
  mode?: "page" | "component";
  comparisonId?: number;
  onSave?: (carIds: number[]) => void;
}

export default function CarCompare({ 
  initialCars = [], 
  mode = "page",
  comparisonId,
  onSave
}: CarCompareProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [compareCars, setCompareCars] = useState<Car[]>(initialCars);
  const [selectedCarId, setSelectedCarId] = useState<string>("");

  // Fetch all cars for the dropdown
  const { data: allCars } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
    enabled: mode === "page", // Only fetch if in page mode
  });

  // Fetch comparison details if comparisonId is provided
  const { data: comparisonData } = useQuery<CarComparison>({
    queryKey: [`/api/comparisons/${comparisonId}`],
    enabled: !!comparisonId,
  });

  // Update component when comparison data changes
  useEffect(() => {
    if (comparisonData && comparisonData.carIds && allCars) {
      const carsToCompare = allCars.filter(car => 
        comparisonData.carIds.includes(car.id)
      );
      setCompareCars(carsToCompare);
    }
  }, [comparisonData, allCars]);

  // Save comparison mutation
  const saveComparisonMutation = useMutation({
    mutationFn: async (carIds: number[]) => {
      if (comparisonId) {
        return await apiRequest("PUT", `/api/comparisons/${comparisonId}`, { carIds });
      } else {
        return await apiRequest("POST", "/api/comparisons", { carIds });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comparisons"] });
      toast({
        title: "Comparison saved",
        description: "Your car comparison has been saved successfully.",
      });
      if (onSave) {
        onSave(compareCars.map(car => car.id));
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving comparison",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete comparison mutation
  const deleteComparisonMutation = useMutation({
    mutationFn: async () => {
      if (comparisonId) {
        return await apiRequest("DELETE", `/api/comparisons/${comparisonId}`);
      }
      throw new Error("No comparison ID provided");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comparisons"] });
      toast({
        title: "Comparison deleted",
        description: "Your car comparison has been deleted.",
      });
      setCompareCars([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting comparison",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddCar = () => {
    if (!selectedCarId) return;
    
    const carId = parseInt(selectedCarId);
    const carToAdd = allCars?.find(car => car.id === carId);
    
    if (carToAdd && !compareCars.find(car => car.id === carId)) {
      setCompareCars([...compareCars, carToAdd]);
      setSelectedCarId("");
    }
  };

  const handleRemoveCar = (carId: number) => {
    setCompareCars(compareCars.filter(car => car.id !== carId));
  };

  const handleSaveComparison = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save comparisons",
        variant: "destructive",
      });
      return;
    }

    if (compareCars.length < 2) {
      toast({
        title: "More cars needed",
        description: "Please add at least two cars to compare",
        variant: "destructive",
      });
      return;
    }

    saveComparisonMutation.mutate(compareCars.map(car => car.id));
  };

  const handleDeleteComparison = () => {
    if (comparisonId) {
      deleteComparisonMutation.mutate();
    }
  };

  // Check if a feature exists in the car's features
  const hasFeature = (car: Car, feature: string) => {
    return car.features?.some(f => 
      f.toLowerCase().includes(feature.toLowerCase())
    ) || false;
  };

  // Get feature availability icon/text
  const getFeatureIndicator = (car: Car, feature: string) => {
    return hasFeature(car, feature) ? (
      <span className="text-green-500">Yes</span>
    ) : (
      <span className="text-gray-400">No</span>
    );
  };

  return (
    <div className="space-y-6">
      {mode === "page" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("cars.compare.title")}</span>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSaveComparison} 
                  disabled={compareCars.length < 2 || saveComparisonMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("cars.compare.saveComparison")}
                </Button>
                
                {comparisonId && (
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteComparison}
                    disabled={deleteComparisonMutation.isPending}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4 mb-8">
              <div className="grid grid-cols-2 gap-4 flex-grow">
                <Select
                  value={selectedCarId}
                  onValueChange={setSelectedCarId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("cars.compare.addCar")} />
                  </SelectTrigger>
                  <SelectContent>
                    {allCars?.filter(car => !compareCars.some(c => c.id === car.id))
                      .map(car => (
                        <SelectItem key={car.id} value={car.id.toString()}>
                          {car.year} {car.make} {car.model} - ${car.price.toLocaleString()}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                
                <Button onClick={handleAddCar} disabled={!selectedCarId}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("cars.compare.addCar")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {compareCars.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">No cars to compare</h3>
          <p className="text-muted-foreground mb-6">Add cars to start comparing their specifications and features.</p>
          
          <Button asChild>
            <Link href="/cars">Browse Cars</Link>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="specifications">
          <TabsList className="mb-6">
            <TabsTrigger value="specifications">{t("cars.compare.specifications")}</TabsTrigger>
            <TabsTrigger value="features">{t("cars.compare.features")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Specification</TableHead>
                    {compareCars.map(car => (
                      <TableHead key={car.id} className="min-w-[200px]">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{car.year}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCar(car.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="font-bold">
                            {car.make} {car.model}
                          </div>
                          <div className="text-primary font-semibold">
                            ${car.price.toLocaleString()}
                          </div>
                          {car.imageUrls && car.imageUrls[0] && (
                            <div className="h-28 overflow-hidden rounded-md">
                              <img
                                src={car.imageUrls[0]}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={compareCars.length + 1} className="bg-gray-50 dark:bg-gray-900 font-semibold">
                      Basic Information
                    </TableCell>
                  </TableRow>
                  {specCategories.basic.map(spec => (
                    <TableRow key={spec.key}>
                      <TableCell className="font-medium">{spec.label}</TableCell>
                      {compareCars.map(car => (
                        <TableCell key={`${car.id}-${spec.key}`}>
                          {/* @ts-ignore - Dynamic property access */}
                          {spec.format ? spec.format(car[spec.key]) : car[spec.key] || 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  
                  <TableRow>
                    <TableCell colSpan={compareCars.length + 1} className="bg-gray-50 dark:bg-gray-900 font-semibold">
                      Vehicle Details
                    </TableCell>
                  </TableRow>
                  {specCategories.details.map(spec => (
                    <TableRow key={spec.key}>
                      <TableCell className="font-medium">{spec.label}</TableCell>
                      {compareCars.map(car => (
                        <TableCell key={`${car.id}-${spec.key}`}>
                          {/* @ts-ignore - Dynamic property access */}
                          {spec.format ? spec.format(car[spec.key]) : car[spec.key] || 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  
                  <TableRow>
                    <TableCell colSpan={compareCars.length + 1} className="bg-gray-50 dark:bg-gray-900 font-semibold">
                      Location Information
                    </TableCell>
                  </TableRow>
                  {specCategories.location.map(spec => (
                    <TableRow key={spec.key}>
                      <TableCell className="font-medium">{spec.label}</TableCell>
                      {compareCars.map(car => (
                        <TableCell key={`${car.id}-${spec.key}`}>
                          {/* @ts-ignore - Dynamic property access */}
                          {car[spec.key] || 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="features">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Feature</TableHead>
                    {compareCars.map(car => (
                      <TableHead key={car.id} className="min-w-[200px]">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{car.year}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveCar(car.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="font-bold">
                            {car.make} {car.model}
                          </div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featureCategories.map((feature, index) => (
                    <TableRow key={feature}>
                      <TableCell className="font-medium">{feature}</TableCell>
                      {compareCars.map(car => (
                        <TableCell key={`${car.id}-${feature}`}>
                          {getFeatureIndicator(car, feature)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {mode === "component" && compareCars.length >= 2 && (
        <div className="flex justify-end mt-4">
          <Button onClick={() => onSave && onSave(compareCars.map(car => car.id))}>
            <Save className="h-4 w-4 mr-2" />
            {t("cars.compare.saveComparison")}
          </Button>
        </div>
      )}
    </div>
  );
}
