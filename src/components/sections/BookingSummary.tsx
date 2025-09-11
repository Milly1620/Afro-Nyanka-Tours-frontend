import { Button } from "@/components/ui/button";

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

interface BookingSummaryProps {
  formData: BookingForm;
  activities: string[];
  onBack: () => void;
  onCompleteBooking: () => void;
  isSubmitting: boolean;
}

export function BookingSummary({
  formData,
  activities,
  onBack,
  onCompleteBooking,
  isSubmitting,
}: BookingSummaryProps) {
  console.log({formData,activities});
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Summary Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A2C00]">
            Booking summary
          </h2>
        </div>

        {/* Country and Destination */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="">
            <p className="text-sm text-gray-600 mb-1">Country</p>
            <p className="font-medium text-gray-900">
              {formData?.selectedCountry}
            </p>
          </div>
          <div className="w-full sm:w-px sm:h-8 bg-gray-300 hidden sm:block"></div>
          <div className="">
            <p className="text-sm text-gray-600 mb-1">Destination</p>
            <p className="font-medium text-gray-900">
              {formData?.selectedDestinations.join(", ")}
            </p>
          </div>
        </div>

        {/* Activities */}
        <div>
          <p className="text-sm text-gray-600 mb-3">Activities</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#FFA75D] rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Date */}
        <div className="border-b border-gray-200 pb-4 sm:pb-6">
          <p className="text-sm text-gray-600 mb-3">Preferred date</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600">From:</p>
              <p className="font-medium text-gray-900">
                {formData?.startDate?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">To:</p>
              <p className="font-medium text-gray-900">
                {formData?.endDate?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Name</p>
            <p className="font-medium text-gray-900">{formData?.name}</p>
          </div>
          <div className="w-full md:w-px md:h-12 bg-gray-300 hidden md:block"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium text-gray-900 break-all">
              {formData?.email}
            </p>
          </div>
          <div className="w-full md:w-px md:h-12 bg-gray-300 hidden md:block"></div>
          <div className="w-16 md:w-10">
            <p className="text-sm text-gray-600 mb-1">Age</p>
            <p className="font-medium text-gray-900">{formData?.age}</p>
          </div>
          <div className="w-full md:w-px md:h-12 bg-gray-300 hidden md:block"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Country of origin</p>
            <p className="font-medium text-gray-900">{formData?.country}</p>
          </div>
        </div>

        {/* Number of Persons */}
        <div>
          <p className="text-sm text-gray-600 mb-1">No. Persons</p>
          <p className="font-medium text-gray-900">
            {formData?.numberOfPersons}
          </p>
        </div>

        {/* Additional Services */}
        <div>
          <p className="text-sm text-gray-600 mb-3">Additional services</p>
          <p className="text-gray-700 leading-relaxed">
            {formData?.additionalServices ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
          <Button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
          >
            Back
          </Button>
          <Button
            onClick={onCompleteBooking}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2 bg-[#FFA75D] hover:bg-[#FF9A4D] text-white "
          >
            {isSubmitting ? "Processing..." : "Complete booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
