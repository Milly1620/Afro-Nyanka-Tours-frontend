import { Star } from "lucide-react";
import { designTestimonials } from "@/data/designTestimonials";
import { useResource } from "@/hooks/useResource";
import { testimonialsApi } from "@/services/api";
import type { Testimonial } from "@/types/api";

const MAX_STARS = 5;

function Stars({ rating }: { rating: number }) {
  const filled = Math.max(0, Math.min(MAX_STARS, Math.round(rating)));
  return (
    <div className="flex gap-[3px]" role="img" aria-label={`${filled} out of ${MAX_STARS} stars`}>
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <Star
          key={index}
          className={`size-[15px] ${index < filled ? "fill-[#F47B20] text-[#F47B20]" : "text-[#E7DCC7]"}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex min-w-0 flex-1 flex-col items-start gap-[18px]">
      <Stars rating={testimonial.rating} />
      <blockquote className="font-[Manrope,sans-serif] text-[16px] leading-[27px] text-[#4A4A4A]">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="flex flex-col gap-0.5 pt-1 font-[Manrope,sans-serif]">
        <span className="text-[15px] font-bold text-[#232323]">{testimonial.author_name}</span>
        {testimonial.tour_name && <span className="text-[13px] font-medium text-[#8C8C8C]">{testimonial.tour_name}</span>}
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const { data, loading } = useResource(() => testimonialsApi.list(), []);

  if (loading) return null;

  const published = data ?? [];
  const testimonials = (published.length > 0 ? published : designTestimonials).slice(0, 3);

  return (
    <section id="testimonials" className="bg-[#F4EFE9] px-4 py-10 sm:px-6 lg:px-[100px]">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-10">
        <h2 className="poppins-bold text-center text-[28px] leading-[1.2] text-[#482B11] md:text-[48px]">
          What travellers say
        </h2>
        <div className="flex w-full flex-col gap-8 md:flex-row md:gap-10">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="flex min-w-0 flex-1 gap-10">
              {index > 0 && <div className="hidden w-px self-stretch bg-[#E7DCC7] md:block" />}
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
