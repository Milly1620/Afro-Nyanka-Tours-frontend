import frame1 from "../../assets/adinkra.svg";
import frame2 from "../../assets/agyindawuru.svg";
import frame3 from "../../assets/nyame.svg";
import frame4 from "../../assets/spiral.svg";

export function AboutSection() {
  return (
    <section id="about" className="py-4 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6 lg:mb-8 w-full">
            <img
              src={frame1}
              alt="Adinkra symbol"
              className="hidden md:block w-12 lg:w-16"
            />
            <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-[#482B11] text-center mx-4 lg:mx-8">
              About Afro Nyanka Tours
            </h2>
            <img
              src={frame2}
              alt="Agyindawuru symbol"
              className="hidden md:block w-12 lg:w-16"
            />
          </div>

          <div className="flex items-center justify-center gap-4 lg:gap-8">
            <img
              src={frame3}
              alt="Nyame symbol"
              className="hidden md:block w-8 lg:w-12"
            />
            <p className="text-base lg:text-lg text-[#6E7070] leading-relaxed poppins-regular text-center max-w-4xl">
              We are passionate about showcasing the beauty and diversity of
              West Africa. With years of experience and deep local knowledge, we
              create authentic experiences that connect travelers with the heart
              of African culture.
            </p>
            <img
              src={frame4}
              alt="Spiral symbol"
              className="hidden md:block w-8 lg:w-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
