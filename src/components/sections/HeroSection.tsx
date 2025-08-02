import { useState } from "react";
import heromain from "../../assets/heromain.svg";
import carousel1 from "../../assets/carousel1.jpeg";
import carousel2 from "../../assets/carousel2.jpeg";
import carousel3 from "../../assets/carousel3.jpeg";
import carousel4 from "../../assets/carousel4.jpeg";
import frame1 from "../../assets/adinkrawhite.svg";
import frame2 from "../../assets/agyindawuruwhite.svg";
import frame3 from "../../assets/nyamewhite.svg";
import frame4 from "../../assets/spiralwhite.svg";

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      <section className="h-[450px] lg:h-[714px] relative flex flex-col justify-center overflow-hidden bg-[url('/src/assets/carousel3.jpeg')]  bg-center bg-no-repeat bg-blend-multiply">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center text-white  ">
          <div className="md:flex items-center justify-between mb-6 lg:w-[1204px]">
            <img src={frame1} alt="frame1" className="hidden md:block" />
            <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-center">
              Discover the Heart of Africa
            </h2>
            <img src={frame2} alt="frame2" className="hidden md:block" />
          </div>
          <div className="flex items-center gap-[35.75px]">
            <img src={frame3} alt="frame3" className="hidden md:block" />
            <p className="lg:w-[776px] text-sm md:text-base lg:text-lg leading-relaxed poppins-regular text-center">
              Experience authentic African culture through our expertly guided
              tours across Ghana, Cote D'Ivoire, Togo, Burkina Faso and beyond
            </p>
            <img src={frame4} alt="frame4" className="hidden md:block" />
          </div>
        </div>

        {/* Bottom Carousel Cards */}
      </section>
      <div className="hidden lg:block lg:absolute bottom-[-110px] left-0 right-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Cards Container */}
          <div className="flex justify-center gap-6.5">
            {carouselCards.map((card, index) => {
              const centerIndex = Math.floor(carouselCards.length / 2);
              const distance = index - centerIndex;
              const rotate = distance * 4;
              const marginTop = Math.pow(distance, 2) * 5;
              const transform = ` rotate(${rotate}deg)`;

              return (
                <div
                  className="flex flex-col items-center"
                  key={index}
                  style={{ transform, marginTop }}
                >
                  <div
                    key={index}
                    className={`relative w-[100px] lg:w-[160px] xl:w-[214.45px] h-[100px] lg:h-[160px] xl:h-[212.38px] rounded-[16.79px] overflow-hidden bg-gradient-to-br ${card.bgColor} shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:border-2 hover:border-[#FFA75D] cursor-pointer`}
                    onClick={() => goToSlide(index)}
                    style={{
                      boxShadow:
                        "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${card.src})`,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-[16.78px] text-[#482B11] poppins-semibold mt-2.5 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs poppins-medium text-[#6E7070]">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3">
            {carouselCards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-[#CB881C]"
                    : "border border-[#482B11]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const carouselCards = [
  {
    src: heromain,
    title: "Culture",
    subtitle: "See More",
    bgColor: "from-orange-400 to-[#FFA75D]",
  },
  {
    src: carousel1,
    title: "History",
    subtitle: "See More",
    bgColor: "from-green-400 to-green-600",
  },
  {
    src: carousel2,
    title: "Discovery",
    subtitle: "See More",
    bgColor: "from-blue-400 to-blue-600",
  },
  {
    src: carousel3,
    title: "Scenery",
    subtitle: "See More",
    bgColor: "from-amber-400 to-amber-600",
  },
  {
    src: carousel4,
    title: "Adventure",
    subtitle: "See More",
    bgColor: "from-sky-400 to-sky-600",
  },
];
