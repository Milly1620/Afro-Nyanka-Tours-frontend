import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "destination" | "attraction" | "service";
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = "default",
  onClick,
}: CardProps) {
  const baseClasses = "bg-white rounded-lg overflow-hidden shadow-md";
  const variantClasses = {
    default: "p-6",
    destination: "relative cursor-pointer hover:shadow-lg transition-shadow",
    attraction: "cursor-pointer hover:shadow-lg transition-shadow",
    service: "relative h-64 cursor-pointer hover:shadow-lg transition-shadow",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 pb-2", className)}>{children}</div>;
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 pt-0", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 pt-2", className)}>{children}</div>;
}
