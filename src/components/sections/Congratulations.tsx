import congratulations from "../../assets/congrat.svg";
import { BookingConfirmationDetails } from "@/components/booking/BookingConfirmationDetails";
import type { BookingCreateResponse } from "@/types/api";

interface CongratulationsProps {
  confirmation: BookingCreateResponse;
  onDone: () => void;
}

export function Congratulations({ confirmation, onDone }: CongratulationsProps) {
  return (
    <div className="flex flex-col items-center justify-center md:w-[450px] min-h-[600px] bg-white rounded-[50px] p-[50px] shadow max-w-4xl mx-auto">
      <div className="mb-6">
        <img src={congratulations} alt="congratulations" />
      </div>

      <div className="md:w-[350px] text-center mb-6">
        <h2 className="text-[32px] poppins-bold text-[#482B11] mb-2.5">
          Congratulations!
        </h2>
        <p className="text-[#4A2C00] text-lg">{confirmation.message}</p>
        {confirmation.summary.status === "pending" && (
          <p className="mt-2 text-sm text-[#6E7070]">
            Your booking is pending confirmation. We will email you once it is confirmed.
          </p>
        )}
      </div>

      <div className="mb-8 w-full">
        <BookingConfirmationDetails confirmation={confirmation} />
      </div>

      <button
        onClick={onDone}
        className="w-full bg-[#FFA75D] hover:bg-[#FF9A4D] text-[#482B11] font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
      >
        Done
      </button>
    </div>
  );
}
