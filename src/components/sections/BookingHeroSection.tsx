import frame1 from "../../assets/adinkrawhite.svg";
import frame2 from "../../assets/agyindawuruwhite.svg";
import frame3 from "../../assets/nyamewhite.svg";
import frame4 from "../../assets/spiralwhite.svg";
import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Tour } from "@/types/api";

interface SearchData {
  country: string;
  destinations: string[];
  activities: string[];
  startDate: Date | null;
  endDate: Date | null;
  toursData: Tour[]; // Tour data from Redux
}

interface BookingForm {
  name: string;
  email: string;
  age: string;
  country: string;
  date: string;
  additionalServices: string;
  numberOfPersons: string;
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
  rows?: number;
  options?: string[];
}

interface BookingHeroSectionProps {
  searchData: SearchData;
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
  rows,
  options,
}: FormFieldProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const inputClasses =
    "w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFA75D] placeholder:text-[#ADADAD] focus:border-transparent outline-none transition-colors";

  const validationRules = {
    ...(required && { required: `${label} is required` }),
    ...validation,
  };

  if (options) {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 focus:outline-none focus:border-[#FFA75D] focus:ring-2 focus:ring-orange-100"
        >
          <span className="text-sm text-gray-900">
            {register(name).value || placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              openDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown && (
          <div className="absolute top-20 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  register(name).onChange({ target: { value: option } });
                  setOpenDropdown(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FFA75D] transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
              >
                {option}
              </button>
            ))}
          </div>
        )}
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

export function BookingHeroSection({ searchData }: BookingHeroSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingForm>();

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Map the form data to the API structure
      const tourSelections = searchData.destinations
        .map((destination, index) => {
          // Find the tour by name to get the tour_id
          const tour = searchData.toursData.find(
            (t: Tour) => t.name === destination
          );
          if (!tour) return null;

          // Get the location IDs for the selected activities
          const locationIds = searchData.activities
            .filter((activity) => {
              // Check if this activity belongs to this tour
              return tour.tour_locations.some(
                (tl: any) => tl.location.name === activity
              );
            })
            .map((activity) => {
              const tourLocation = tour.tour_locations.find(
                (tl: any) => tl.location.name === activity
              );
              return tourLocation?.location_id || 0;
            })
            .filter((id) => id > 0);

          return {
            locations: locationIds,
            order: index + 1,
            tour_id: tour.id,
          };
        })
        .filter(Boolean);

      const payload = {
        customer_name: data.name,
        customer_email: data.email,
        customer_age: parseInt(data.age),
        customer_country: data.country,
        number_of_people: parseInt(data.numberOfPersons),
        preferred_date: new Date(data.date).toISOString(),
        additional_services: data.additionalServices || "",
        tour_selections: tourSelections,
      };

      

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Booking submitted successfully! We'll confirm your tour details soon.",
        });
        reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitStatus({
          type: "error",
          message:
            errorData.message || "Failed to submit booking. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
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
      placeholder: "Enter your country",
      required: true,
    },
    {
      label: "Number of Persons",
      name: "numberOfPersons" as keyof BookingForm,
      type: "number",
      placeholder: "Enter number of Persons",
      required: true,
    },
    {
      label: "Preferred date",
      name: "date" as keyof BookingForm,
      type: "date",
      placeholder: "dd/mm/yyyy",
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
    <section className="h-[400px] lg:h-[450px] flex flex-col justify-center overflow-hidden bg-black/40 bg-[url('/src/assets/heromain.svg')] bg-cover bg-no-repeat bg-blend-multiply mb-[850px] md:mb-[582.19px]">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-white">
        <div className="md:flex items-center justify-between mb-6 lg:w-[1204px]">
          <img src={frame1} alt="frame1" className="hidden md:block" />
          <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-center">
            Book Your Tour
          </h2>
          <img src={frame2} alt="frame2" className="hidden md:block" />
        </div>
        <div className="flex items-center gap-[35.75px]">
          <img src={frame3} alt="frame3" className="hidden md:block" />
          <p className="lg:w-[776px] text-sm md:text-base lg:text-lg leading-relaxed poppins-regular text-center">
            Start planning your African adventure today
          </p>
          <img src={frame4} alt="frame4" className="hidden md:block" />
        </div>
      </div>

      <div className="absolute top-[302px] md:top-[322px] lg:top-[352px] left-0 right-0 z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Search Summary */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Tour Summary
            </h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p>
                <strong>Country:</strong> {searchData.country}
              </p>
              <p>
                <strong>Destinations:</strong>{" "}
                {searchData.destinations.join(", ")}
              </p>
              <p>
                <strong>Activities:</strong> {searchData.activities.join(", ")}
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {searchData.startDate?.toLocaleDateString()} -{" "}
                {searchData.endDate?.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus.type && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <p className="text-sm font-medium">{submitStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                {...formFields[0]}
                errors={errors}
                register={register}
              />
              <FormField
                {...formFields[1]}
                errors={errors}
                register={register}
              />
            </div>

            {/* Age and Country Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                {...formFields[2]}
                errors={errors}
                register={register}
              />
              <FormField
                {...formFields[3]}
                errors={errors}
                register={register}
              />
            </div>

            {/* Number of Persons and Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                {...formFields[4]}
                errors={errors}
                register={register}
              />
              <FormField
                {...formFields[5]}
                errors={errors}
                register={register}
              />
            </div>

            {/* Additional Services */}
            <FormField {...formFields[6]} errors={errors} register={register} />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FFA75D] hover:bg-[#FFA75D] text-white px-8 py-3 rounded-xl font-semibold text-base transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="h-5 w-5 mr-2" />
                {isSubmitting ? "Submitting..." : "Book now"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
