import { useState } from "react";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import attraction images
import castleImg from "../../assets/castle.svg";
import blackstarsquareImg from "../../assets/blackstarsquare.svg";
import mosqueImg from "../../assets/mosque.svg";
import kakumImg from "../../assets/kakum.svg";

const AttractionCard = ({ attraction }: AttractionCardProps) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="relative overflow-hidden">
      <img
        src={attraction.image}
        alt={attraction.title}
        className="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <div className="p-6">
      <h3 className="text-sm lg:text-[16.61px] poppins-semibold text-[#0D0D0C] mb-[7.3px] group-hover:text-[#FFA75D] transition-colors poppins-medium">
        {attraction.title}
      </h3>

      <div className="flex items-center text-[#6E7070] mb-2">
        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="text-[14.76px] poppins-regular">
          {attraction.location}
        </span>
      </div>

      <div className="text-[22.14px] poppins-medium text-[#0D0D0C] mb-2 lg:mb-[32.72px]">
        {attraction.currency}
        {attraction.price.toFixed(2)}
        <span className="text-[16.61px] poppins-regular text-[#6E7070]">
          /Person
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-[#6E7070]">
          <Clock size={14.76} className="mr-2" />
          <span className="text-[14.76px] poppins-regular">
            {attraction.duration}
          </span>
        </div>

        <Button className="p-3 lg:px-4 lg:py-2  bg-transparent text-[#482B11] hover:text-[#FFA75D] poppins-medium text-sm transition-colors group border border-[#E1E4E5]  hover:bg-transparent cursor-pointer">
          <span className="text-[14.76px] poppins-medium">Book Now</span>
          <ArrowRight className="h-6 w-6 ml-1 text-[#FFA75D] group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  </div>
);

export function AttractionsSection() {
  const [activeCategory, setActiveCategory] = useState("Ghana");

  const filteredAttractions = attractions.filter(
    (attraction) => attraction.category === activeCategory
  );

  return (
    <section id="attractions" className="py-5 lg:py-10 bg-[#E6E6E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 lg:mb-6">
          <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-[#482B11] mb-4">
            Popular attractions
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 poppins-regular max-w-2xl mx-auto">
            Explore the best destinations across West Africa
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 lg:gap-4 mb-5 lg:mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`p-3 lg:px-4 lg:py-2 text-sm md:text-base lg:text-base font-medium transition-all duration-200 rounded-xl poppins-medium ${
                activeCategory === category
                  ? "bg-[#101010A1] text-white"
                  : "bg-white text-[#482B11] "
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7.5 mb-5 lg:mb-6">
          {filteredAttractions.map((attraction) => (
            <AttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>

        <div className="text-center">
          <button className="text-[#6E7070] cursor-pointer hover:text-[#FFA75D] poppins-medium transition-colors poppins-medium text-base lg:text-lg">
            View more
          </button>
        </div>
      </div>
    </section>
  );
}
interface Attraction {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  duration: string;
  image: string;
  category: string;
  slug: string;
}

interface AttractionCardProps {
  attraction: Attraction;
}

const attractions: Attraction[] = [
  {
    id: "1",
    title: "Cape coast castle",
    location: "Cape coast",
    price: 600,
    currency: "$",
    duration: "5 Days",
    image: castleImg,
    category: "Ghana",
    slug: "cape-coast-castle",
  },
  {
    id: "2",
    title: "Independence square",
    location: "Accra",
    price: 600,
    currency: "$",
    duration: "6 Days",
    image: blackstarsquareImg,
    category: "Ghana",
    slug: "independence-square",
  },
  {
    id: "3",
    title: "Larabanga Mosque",
    location: "Tamale",
    price: 250,
    currency: "$",
    duration: "6 Days",
    image: mosqueImg,
    category: "Ghana",
    slug: "larabanga-mosque",
  },
  {
    id: "4",
    title: "Kakum national park",
    location: "Cape coast",
    price: 569,
    currency: "$",
    duration: "3 Days",
    image: kakumImg,
    category: "Ghana",
    slug: "kakum-national-park",
  },
];

const categories = ["Ghana", "Côte d'Ivoire", "Togo", "Burkina Faso"];
