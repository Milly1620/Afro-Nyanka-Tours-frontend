import congratulations from "../../assets/congrat.svg";
interface CongratulationsProps {
  onDone: () => void;
}

export function Congratulations({ onDone }: CongratulationsProps) {
  return (
    <div 
    className="flex flex-col items-center justify-center md:w-[450px] md:h-[600px] bg-white rounded-[50px] p-[50px] shadow max-w-4xl mx-auto"
    >
      {/* Celebration Illustration */}
      <div className="mb-6">
        <img src={congratulations} alt="congratulations" />
      </div>

      {/* Congratulations Text */}
      <div className="md:w-[350px] text-center mb-[44px]">
        <h2 className="text-[32px] poppins-bold text-[#482B11] mb-2.5">
          Congratulations!
        </h2>
        <p className="text-[#4A2C00] text-lg">
          Your booking has been received, we will get back to you shortly
        </p>
      </div>

      {/* Done Button */}
      <button
        onClick={onDone}
        className="w-full bg-[#FFA75D] hover:bg-[#FF9A4D] text-[#482B11] font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
      >
        Done
      </button>
    </div>
  );
}
