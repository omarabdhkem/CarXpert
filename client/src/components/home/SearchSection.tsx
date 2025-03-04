import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

// Car makes for dropdown
const carMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "BMW", 
  "Mercedes-Benz", "Audi", "Nissan", "Hyundai", "Kia",
  "Volkswagen", "Mazda", "Subaru", "Lexus", "Tesla"
];

// Form schema
const searchFormSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minYear: z.number().optional(),
  maxYear: z.number().optional(),
  condition: z.string().optional(),
  bodyType: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export default function SearchSection() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      make: "",
      model: "",
      minPrice: 0,
      maxPrice: 100000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      condition: "",
      bodyType: "",
    },
  });

  function onSubmit(data: SearchFormValues) {
    // Create query params for search
    const queryParams = new URLSearchParams();
    
    if (data.make) queryParams.append("make", data.make);
    if (data.model) queryParams.append("model", data.model);
    if (data.minPrice) queryParams.append("minPrice", data.minPrice.toString());
    if (data.maxPrice) queryParams.append("maxPrice", data.maxPrice.toString());
    if (data.minYear) queryParams.append("minYear", data.minYear.toString());
    if (data.maxYear) queryParams.append("maxYear", data.maxYear.toString());
    if (data.condition) queryParams.append("condition", data.condition);
    if (data.bodyType) queryParams.append("bodyType", data.bodyType);

    // Navigate to search results
    setLocation(`/search?${queryParams.toString()}`);
  }

  const addFilter = (filter: string) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  return (
    <section className="py-12">
      <div className="container">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">{t("search.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Make */}
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.make")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
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

                  {/* Model - Text input since models depend on make */}
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("search.filters.model")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("search.filters.model")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button type="submit" className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      {t("search.buttons.search")}
                    </Button>
                  </div>
                </div>

                {/* Advanced Search Toggle */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? t("common.less") : t("common.more")}
                  </Button>
                </div>

                {/* Advanced Search Options */}
                {showAdvanced && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Price Range */}
                      <div>
                        <FormLabel>{t("search.filters.priceRange")}</FormLabel>
                        <div className="pt-6 px-2">
                          <Slider
                            defaultValue={[0, 100000]}
                            max={200000}
                            step={1000}
                            onValueChange={(value) => {
                              setPriceRange(value as [number, number]);
                              form.setValue("minPrice", value[0]);
                              form.setValue("maxPrice", value[1]);
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
                                onValueChange={(value) => field.onChange(parseInt(value))}
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
                                onValueChange={(value) => field.onChange(parseInt(value))}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Condition */}
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("search.filters.condition")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
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
                                addFilter(`${t("search.filters.fuelType")}: ${t(`cars.fuelTypes.${value}`)}`);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("search.filters.fuelType")} />
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
                                addFilter(`${t("search.filters.transmission")}: ${value}`);
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
                                addFilter(`${t("search.filters.color")}: ${value}`);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("search.filters.color")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="white">White</SelectItem>
                                <SelectItem value="silver">Silver</SelectItem>
                                <SelectItem value="gray">Gray</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="brown">Brown</SelectItem>
                                <SelectItem value="orange">Orange</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Active Filters */}
                {selectedFilters.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Active Filters:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFilters.map((filter) => (
                        <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                          {filter}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFilter(filter)}
                          />
                        </Badge>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFilters([])}
                        className="text-xs h-7"
                      >
                        {t("search.buttons.clear")}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
