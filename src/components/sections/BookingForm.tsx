import { useState, useEffect, forwardRef, useMemo, useRef } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Tour } from "@/types/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toursApi } from "@/services/api";
import { ALL_COUNTRIES } from "@/data/countries";
import countryCodes from "@/data/country-codes.json";

interface BookingForm {
  selectedCountry: string;
  selectedDestinations: string[];
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  email: string;
  age: string;
  country: string;
  additionalServices: string;
  numberOfPersons: string;
}

interface SearchData {
  country: string;
  destinations: string[];
  activities: string[];
  startDate: Date | null;
  endDate: Date | null;
  toursData: Tour[];
}

interface FormFieldProps {
  label: string;
  name: keyof BookingForm;
  type?: string;
  placeholder: string;
  required?: boolean;
  validation?: object;
  errors: any;
  register: any;
  control?: any;
  rows?: number;
  options?: string[];
  isSelect?: boolean;
  isMultiSelect?: boolean;
  isDisplayOnly?: boolean;
  displayValue?: string;
}

interface BookingFormProps {
  searchData: SearchData;
  onSubmit: (data: BookingForm) => void;
  isSubmitting: boolean;
  initialFormData?: BookingForm | null;
}

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  validation = {},
  errors,
  register,
  control,
  rows,
  options,
  isSelect = false,
  isMultiSelect = false,
  isDisplayOnly = false,
  displayValue,
}: FormFieldProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [filterTerm, setFilterTerm] = useState("");

  const inputClasses =
    "w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFA75D] placeholder:text-[#ADADAD] focus:border-transparent outline-none transition-colors";

  const validationRules = {
    ...(required && { required: `${label} is required` }),
    ...validation,
  };

  // Display-only field (like activities)
  if (isDisplayOnly) {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {displayValue || placeholder}
          </span>
        </div>
      </div>
    );
  }

  const isOriginCountry = name === "country";

  const codeMap = useMemo(() => {
    const map: Record<string, string> = {};
    (countryCodes as { name: string; code: string }[]).forEach(
      ({ name, code }) => (map[name] = code)
    );
    return map;
  }, []);

  const codeToEmoji = (code?: string) => {
    if (!code) return "";
    const A = 127462; // 0x1F1E6
    return String.fromCodePoint(
      ...code
        .toUpperCase()
        .split("")
        .map((c) => A + (c.charCodeAt(0) - 65))
    );
  };

  if (isSelect && options) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!openDropdown) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setOpenDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdown]);

    return (
      <div ref={wrapperRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <Controller
          name={name}
          control={control}
          rules={validationRules}
          render={({ field }) => {
            const filteredOptions = isOriginCountry
              ? options.filter((opt) =>
                  opt.toLowerCase().includes(filterTerm.toLowerCase())
                )
              : options;

            const displayValue = isMultiSelect
              ? Array.isArray(field.value) && field.value.length > 0
                ? `${field.value.length} selected`
                : placeholder
              : field.value || placeholder;

            const toggleOption = (option: string) => {
              if (isMultiSelect) {
                const currentValues = Array.isArray(field.value)
                  ? field.value
                  : [];
                const newValues = currentValues.includes(option)
                  ? currentValues.filter((v) => v !== option)
                  : [...currentValues, option];
                field.onChange(newValues);
              } else {
                field.onChange(option);
                setOpenDropdown(false);
              }
            };

            return (
              <>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="w-full h-10 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-[#FFA75D] focus:ring-2 focus:ring-orange-100"
                >
                  <span className="text-sm text-gray-900">{displayValue}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      openDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown && (
                  <div className="absolute top-20 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    {isOriginCountry && (
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <input
                          value={filterTerm}
                          onChange={(e) => setFilterTerm(e.target.value)}
                          placeholder="Search country..."
                          className="w-full h-9 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#FFA75D] focus:ring-2 focus:ring-orange-100"
                        />
                      </div>
                    )}
                    {(filteredOptions.length ? filteredOptions : [
                      "No results",
                    ]).map((option, index) => {
                      const isSelected = isMultiSelect
                        ? Array.isArray(field.value) &&
                          field.value.includes(option)
                        : field.value === option;

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => option !== "No results" && toggleOption(option)}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 flex items-center gap-3 ${
                            isSelected
                              ? "bg-orange-100 text-[#FFA75D] font-medium"
                              : "text-gray-700 hover:bg-orange-50 hover:text-[#FFA75D]"
                          }`}
                        >
                          {isMultiSelect && option !== "No results" && (
                            <span
                              className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                                isSelected
                                  ? "bg-[#FFA75D] border-[#FFA75D]"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                            {isOriginCountry && option !== "No results" && (
                              <span className="w-4 text-base">
                                {codeToEmoji(codeMap[option])}
                              </span>
                            )}
                            <span>{option}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            );
          }}
        />
        {errors[name] && (
          <p className="text-sm text-red-600 mt-1 poppins-regular">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {rows ? (
        <textarea
          {...register(name, validationRules)}
          rows={rows}
          placeholder={placeholder}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <Input
          {...register(name, validationRules)}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1 poppins-regular">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export function BookingForm({
  searchData,
  onSubmit,
  isSubmitting,
  initialFormData,
}: BookingFormProps) {
  // Custom input for DatePicker to display selected value
  const DateInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void; placeholder?: string }>(
    ({ value, onClick, placeholder }, ref) => (
      <div className="relative" onClick={onClick}>
        <input
          ref={ref}
          type="text"
          value={value || ""}
          className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FFA75D] focus:border-transparent outline-none text-gray-700 placeholder:text-[#ADADAD]"
          placeholder={placeholder}
          readOnly
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A2C00]" />
      </div>
    )
  );
  // Data for select dropdowns
  const [tourCountries, setTourCountries] = useState<string[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [toursData, setToursData] = useState<Tour[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // This will be handled by individual FormField components
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch tour countries (for selecting tour location) on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const countriesData = await toursApi.getCountries();
        const list = countriesData.length > 0 ? countriesData : [];
        // Ensure Ghana appears first when present
        const ghanaFirst = list.sort((a, b) => {
          if (a === "Ghana") return -1;
          if (b === "Ghana") return 1;
          return a.localeCompare(b);
        });
        setTourCountries(ghanaFirst);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setTourCountries(["Ghana"]); // minimal fallback if API fails
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Origin countries (full world list)
  const originCountries = useMemo(() => ALL_COUNTRIES, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingForm>({
    defaultValues: {
      selectedCountry:
        initialFormData?.selectedCountry || searchData.country || "",
      selectedDestinations:
        initialFormData?.selectedDestinations || searchData.destinations || [],
      startDate: initialFormData?.startDate || searchData.startDate || null,
      endDate: initialFormData?.endDate || searchData.endDate || null,
      name: initialFormData?.name || "",
      email: initialFormData?.email || "",
      age: initialFormData?.age || "",
      country: initialFormData?.country || "",
      additionalServices: initialFormData?.additionalServices || "",
      numberOfPersons: initialFormData?.numberOfPersons || "",
    },
  });

  // Watch for country and destinations changes
  const selectedCountry = watch("selectedCountry");
  const selectedDestinations = watch("selectedDestinations");

  // Reset form when initialFormData changes (when navigating back from summary)
  useEffect(() => {
    if (initialFormData) {
      reset({
        selectedCountry: initialFormData.selectedCountry || "",
        selectedDestinations: initialFormData.selectedDestinations || [],
        startDate: initialFormData.startDate || null,
        endDate: initialFormData.endDate || null,
        name: initialFormData.name || "",
        email: initialFormData.email || "",
        age: initialFormData.age || "",
        country: initialFormData.country || "",
        additionalServices: initialFormData.additionalServices || "",
        numberOfPersons: initialFormData.numberOfPersons || "",
      });
    }
  }, [initialFormData, reset]);

  // Fetch tours data when country changes
  useEffect(() => {
    const fetchToursData = async () => {
      if (!selectedCountry) {
        setToursData([]);
        setDestinations([]);
        return;
      }

      setIsLoadingTours(true);
      try {
        const tours = await toursApi.getToursByCountry(selectedCountry);
        setToursData(tours);
        setDestinations(tours.sort((a, b) => a.name.localeCompare(b.name)).map((tour) => tour.name));
      } catch (error) {
        console.error("Error fetching tours:", error);
        setToursData([]);
        setDestinations([]);
      } finally {
        setIsLoadingTours(false);
      }
    };

    fetchToursData();
  }, [selectedCountry]);

  // Compute activities based on selected destinations
  useEffect(() => {
    if (selectedDestinations.length === 0 || toursData.length === 0) {
      setActivities([]);
      return;
    }

    const selectedTours = toursData.filter((tour) =>
      selectedDestinations.includes(tour.name)
    );

    const allActivities = selectedTours.flatMap((tour) =>
      tour.tour_locations.map((tl) => tl.location.name)
    );

    const uniqueActivities = [...new Set(allActivities)];
    setActivities(uniqueActivities);
  }, [selectedDestinations, toursData]);

  // Seed initial data from searchData
  useEffect(() => {
    if (searchData.toursData && searchData.toursData.length > 0) {
      setToursData(searchData.toursData);
      setDestinations(searchData.toursData.map((tour) => tour.name));
    }
  }, [searchData.toursData]);

  const formFields = [
    {
      label: "Country",
      name: "selectedCountry" as keyof BookingForm,
      placeholder: isLoadingCountries
        ? "Loading countries..."
        : "Select country",
      required: true,
      isSelect: true,
      options: tourCountries,
    },
    {
      label: "Destination(s)",
      name: "selectedDestinations" as keyof BookingForm,
      placeholder: isLoadingTours
        ? "Loading destinations..."
        : "Select destinations",
      required: true,
      isSelect: true,
      options: destinations,
      isMultiSelect: true,
    },
    {
      label: "Activities",
      name: "activities" as keyof BookingForm,
      placeholder:
        activities.length === 0
          ? "Select destinations first"
          : `${activities.length} activities available`,
      isDisplayOnly: true,
      displayValue:
        activities.length === 0
          ? "Select destinations first"
          : `${activities.length} activities available`,
    },
    {
      label: "Name",
      name: "name" as keyof BookingForm,
      placeholder: "Enter your name",
      required: true,
    },
    {
      label: "Email",
      name: "email" as keyof BookingForm,
      type: "email",
      placeholder: "Enter your email",
      required: true,
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      label: "Age",
      name: "age" as keyof BookingForm,
      type: "number",
      placeholder: "Enter your age",
      required: true,
    },
    {
      label: "Country of origin",
      name: "country" as keyof BookingForm,
      placeholder: isLoadingCountries
        ? "Loading countries..."
        : "Select country",
      required: true,
      isSelect: true,
      options: originCountries,
    },
    {
      label: "No. Persons",
      name: "numberOfPersons" as keyof BookingForm,
      type: "number",
      placeholder: "1",
      required: true,
    },
    {
      label: "Additional services",
      name: "additionalServices" as keyof BookingForm,
      placeholder: "Write your message",
      rows: 6,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Country and Destinations Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            {...formFields[0]}
            errors={errors}
            register={register}
            control={control}
          />
          <FormField
            {...formFields[1]}
            errors={errors}
            register={register}
            control={control}
          />
        </div>

        {/* Activities and Date Range Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            {...formFields[2]}
            errors={errors}
            register={register}
            control={control}
            displayValue={
              activities.length === 0
                ? "Select destinations first"
                : `${activities.length} activities available`
            }
          />
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-medium text-[#4A2C00]">
              Preferred date
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      customInput={<DateInput placeholder="dd/mm/yyyy" />}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 mt-1 poppins-regular">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <span className="text-[#4A2C00] font-medium">to</span>
              <div className="flex-1 relative">
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      customInput={<DateInput placeholder="dd/mm/yyyy" />}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600 mt-1 poppins-regular">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            {...formFields[3]}
            errors={errors}
            register={register}
            control={control}
          />
          <FormField
            {...formFields[4]}
            errors={errors}
            register={register}
            control={control}
          />
        </div>

        {/* Country of Origin, Age, and Number of Persons Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            {...formFields[6]}
            errors={errors}
            register={register}
            control={control}
          />
          <FormField
            {...formFields[5]}
            errors={errors}
            register={register}
            control={control}
          />
          <FormField
            {...formFields[7]}
            errors={errors}
            register={register}
            control={control}
          />
        </div>

        {/* Additional Services */}
        <FormField
          {...formFields[8]}
          errors={errors}
          register={register}
          control={control}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={() => window.scrollTo(0, 0)}
            className="bg-[#FFA75D] hover:bg-[#FFA75D] text-white px-8 py-3 rounded-xl font-semibold text-base cursor-pointer"
          >
            <Calendar className="h-5 w-5 mr-2" />
            {isSubmitting ? "Submitting..." : "Book now"}
          </Button>
        </div>
      </form>
    </div>
  );
}
