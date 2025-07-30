import { Check } from "lucide-react";
import jumpSvg from "../../assets/jump.svg";
import kwamenkrumahSvg from "../../assets/kwamenkrumah.svg";
import elephantSvg from "../../assets/elephant.svg";

const features = [
  "Expert local guides",
  "Customized itineraries",
  "24/7 support",
];

export function AdventureSection() {
  return (
    <section className="my-5 md:my-10 lg:my-[80px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl lg:leading-13.5 poppins-bold text-[#482B11] mb-4 lg:mb-6 text-center lg:text-left">
              Plan your perfect African adventure
            </h2>
            <p className="text-sm md:text-base lg:text-lg poppins-regular text-gray-600 mb-4 lg:mb-10 text-center lg:text-left">
              Let our experienced team craft a personalized journey that matches
              your dreams. From cultural immersion to wildlife safaris, we
              create memories that last a lifetime.
            </p>

            <ul className="space-y-4 mb-4 lg:mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#FFA75D] rounded-full flex items-center justify-center mr-3">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm md:text-base lg:text-lg poppins-regular text-gray-700">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Large Image - Left Side */}
            <div className="h-full">
              <img
                src={jumpSvg}
                alt="Cultural Experience - Traditional African Community"
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Stacked Images - Right Side */}
            <div className="flex flex-col gap-4 h-full">
              {/* Top Image */}
              <div className="flex-1">
                <img
                  src={kwamenkrumahSvg}
                  alt="Kwame Nkrumah Memorial Park"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Bottom Image */}
              <div className="flex-1">
                <img
                  src={elephantSvg}
                  alt="African Wildlife Safari - Elephant in Natural Habitat"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
