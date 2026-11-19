import { formatGhs } from "@/lib/adminFormat";

interface EstimatedTotalProps {
  total: number;
  className?: string;
}

export function EstimatedTotal({ total, className }: EstimatedTotalProps) {
  return (
    <div className={`rounded-lg bg-orange-50 px-4 py-3 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#4A2C00]">Estimated total</span>
        <span className="text-lg font-semibold text-[#482B11]">
          {formatGhs(total)}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        This is an estimate. We confirm the final price after you book.
      </p>
    </div>
  );
}
