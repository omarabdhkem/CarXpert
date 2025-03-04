import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Search, Sliders } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Form schema
const searchFormSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minYear: z.number().optional(),
  maxYear: z.number().optional(),
  minMileage: z.number().optional(),
  maxMileage: z.number().optional(),
  condition: z.string().optional(),
  bodyType: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  color: z.string().optional(),
  features: z.array(z.string()).optional(),
  location: z.string().optional(),
});

// Car makes
const carMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "BMW", 
  "Mercedes-Benz", "Audi", "Nissan", "Hyundai", "Kia",
  "Volkswagen", "Mazda", "Subaru", "Lexus", "Tesla"
];

// Body types
const bodyTypes = [
  "Sedan", "SUV", "Truck", "Coupe", "Convertible", 
  "Wagon", "Hatchback", "Van", "Minivan"
];

// Fuel types
const fuelTypes = [
  "Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"
];

// Colors
const colors = [
  "Black", "White", "Silver", "Gray", "Red",
  "Blue", "Green", "Brown", "Gold", "Yellow"
];

// Features
const features = [
  "Bluetooth", "Navigation", "Leather Seats", "Sunroof", "Backup Camera",
  "Heated Seats", "Third Row Seating", "Apple CarPlay", "Android Auto",
  "Keyless Entry", "Remote Start", "Adaptive Cruise Control", "Blind Spot Monitoring"
];

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface AdvancedSearchProps {
  className?: string;
  initialValues?: Partial<SearchFormValues>;
  onSearch?: (values: SearchFormValues) => void;
}

export default function AdvancedSearch({ className, initialValues, onSearch }: AdvancedSearchProps) {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [mileageRange, setMileageRange] = useState([0, 200000]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      make: initialValues?.make || "",
      model: initialValues?.model || "",
      minPrice: initialValues?.minPrice || 0,
      maxPrice: initialValues?.maxPrice || 100000,
      minYear: initialValues?.minYear || 2000,
      maxYear: initialValues?.maxYear || new Date().getFullYear(),
      minMileage: initialValues?.minMileage || 0,
      maxMileage: initialValues?.maxMileage || 200000,
      condition: initialValues?.condition || "",
      bodyType: initialValues?.bodyType || "",
      fuelType: initialValues?.fuelType || "",
      transmission: initialValues?.transmission || "",
      color: initialValues?.color || "",
      features: initialValues?.features || [],
      location: initialValues?.location || "",
    },
  });

  function onSubmit(data: SearchFormValues) {
    if (onSearch) {
      onSearch(data);
    } else {
      // Create query params for search
      const queryParams = new URLSearchParams();
      
      if (data.make) queryParams.append("make", data.make);
      if (data.model) queryParams.append("model", data.model);
      if (data.minPrice) queryParams.append("minPrice", data.minPrice.toString());
      if (data.maxPrice) queryParams.append("maxPrice", data.maxPrice.toString());
      if (data.minYear) queryParams.append("minYear", data.minYear.toString());
      if (data.maxYear) queryParams.append("maxYear", data.maxYear.toString());
      if (data.minMileage) queryParams.append("minMileage", data.minMileage.toString());
      if (data.maxMileage) queryParams.append("maxMileage", data.maxMileage.toString());
      if (data.condition) queryParams.append("condition", data.condition);
      if (data.bodyType) queryParams.append("bodyType", data.bodyType);
      if (data.fuelType) queryParams.append("fuelType", data.fuelType);
      if (data.transmission) queryParams.append("transmission", data.transmission);
      if (data.color) queryParams.append("color", data.color);
      if (data.features && data.features.length > 0) {
        data.features.forEach(feature => {
          queryParams.append("features", feature);
        });
      }
      if (data.location) queryParams.append("location", data.location);

      // Navigate to search results
      setLocation(`/search?${queryParams.toString()}`);
    }
  }

  const addFilter = (key: string, value: string) => {
    const filterString = `${key}: ${value}`;
    if (!activeFilters.includes(filterString)) {
      setActiveFilters([...activeFilters, filterString]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    form.reset();
    setPriceRange([0, 100000]);
    setMileageRange([0, 200000]);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Sliders className="h-5 w-5 mr-2" />
          {t("search.title")}
        </h2>
        
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs h-7"
          >
            {t("search.buttons.clear")}
          </Button>
        )}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="multiple" defaultValue={["make-model", "price-year"]}>
            {/* Make and Model */}
            <AccordionItem value="make-model">
              <AccordionTrigger>Make & Model</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.make")}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value) {
                              addFilter(t("search.filters.make"), value);
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("search.filters.make")} />
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
                        <FormLabel>{t("search.filters.model")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("search.filters.model")} 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                addFilter(t("search.filters.model"), e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Price and Year */}
            <AccordionItem value="price-year">
              <AccordionTrigger>Price & Year</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-4">
                  {/* Price Range */}
                  <div>
                    <FormLabel>{t("search.filters.priceRange")}</FormLabel>
                    <div className="pt-6 px-2">
                      <Slider
                        value={priceRange}
                        max={200000}
                        step={1000}
                        onValueChange={(value) => {
                          setPriceRange(value as [number, number]);
                          form.setValue("minPrice", value[0]);
                          form.setValue("maxPrice", value[1]);
                          addFilter(t("search.filters.priceRange"), `$${value[0]} - $${value[1]}`);
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <div>${priceRange[0].toLocaleString()}</div>
                      <div>${priceRange[1].toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Year Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("search.filters.year")} (Min)</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const yearValue = parseInt(value);
                              field.onChange(yearValue);
                              addFilter("Min Year", value);
                            }}
                            defaultValue={field.value?.toString() ?? ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Min Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
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
                      name="maxYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("search.filters.year")} (Max)</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const yearValue = parseInt(value);
                              field.onChange(yearValue);
                              addFilter("Max Year", value);
                            }}
                            defaultValue={field.value?.toString() ?? ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Max Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Vehicle Details */}
            <AccordionItem value="vehicle-details">
              <AccordionTrigger>Vehicle Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Condition */}
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.condition")}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            addFilter(t("search.filters.condition"), t(`cars.conditions.${value}`));
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("search.filters.condition")} />
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

                  {/* Body Type */}
                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            addFilter("Body Type", value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Body Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bodyTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fuel Type */}
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.fuelType")}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            addFilter(t("search.filters.fuelType"), value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("search.filters.fuelType")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fuelTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Transmission */}
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.transmission")}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            addFilter(t("search.filters.transmission"), value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("search.filters.transmission")} />
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

                  {/* Color */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.color")}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            addFilter(t("search.filters.color"), value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("search.filters.color")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem key={color} value={color.toLowerCase()}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mileage Range */}
                  <div className="md:col-span-2">
                    <FormLabel>Mileage</FormLabel>
                    <div className="pt-6 px-2">
                      <Slider
                        value={mileageRange}
                        max={300000}
                        step={1000}
                        onValueChange={(value) => {
                          setMileageRange(value as [number, number]);
                          form.setValue("minMileage", value[0]);
                          form.setValue("maxMileage", value[1]);
                          addFilter("Mileage", `${value[0]} - ${value[1]} miles`);
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <div>{mileageRange[0].toLocaleString()} miles</div>
                      <div>{mileageRange[1].toLocaleString()} miles</div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Features */}
            <AccordionItem value="features">
              <AccordionTrigger>{t("search.filters.features")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        {features.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2 mb-2">
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
                                    addFilter("Feature", feature);
                                  } else {
                                    form.setValue(
                                      "features",
                                      currentFeatures.filter(
                                        (f) => f !== feature.toLowerCase()
                                      )
                                    );
                                    removeFilter(`Feature: ${feature}`);
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
              </AccordionContent>
            </AccordionItem>

            {/* Location */}
            <AccordionItem value="location">
              <AccordionTrigger>{t("search.filters.location")}</AccordionTrigger>
              <AccordionContent>
                <div className="pt-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.location")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City, State or ZIP Code" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                addFilter(t("search.filters.location"), e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type="submit" className="w-full">
            <Search className="h-4 w-4 mr-2" />
            {t("search.buttons.apply")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
