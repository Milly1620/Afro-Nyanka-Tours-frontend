import { useForm } from "react-hook-form";
import { Mail, Phone, Clock, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactForm } from "@/types";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  content: string | React.ReactNode;
}

interface FormFieldProps {
  label: string;
  name: keyof ContactForm;
  type?: string;
  placeholder: string;
  required?: boolean;
  validation?: object;
  errors: any;
  register: any;
  rows?: number;
}

const ContactCard = ({ icon: Icon, title, content }: ContactCardProps) => (
  <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center">
    <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-orange-100 rounded-full flex items-center justify-center mr-4 lg:mr-6">
      <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-[#482B11]" />
    </div>
    <div>
      <h3 className="text-sm md:text-base lg:text-xl text-[#482B11] poppins-medium mb-1 lg:mb-2">
        {title}
      </h3>
      <div className="text-[#6E7070] text-sm lg:text-base">{content}</div>
    </div>
  </div>
);

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  validation = {},
  errors,
  register,
  rows,
}: FormFieldProps) => {
  const inputClasses =
    "w-full px-4 py-3 lg:py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFA75D] placeholder:text-[#ADADAD] focus:border-transparent outline-none transition-colors";

  const validationRules = {
    ...(required && { required: `${label} is required` }),
    ...validation,
  };

  return (
    <div>
      <label className="block text-sm md:text-base poppins-regular mb-2 lg:mb-3">
        {label}
      </label>
      {rows ? (
        <textarea
          {...register(name, validationRules)}
          rows={rows}
          placeholder={placeholder}
          className={`${inputClasses} resize-none`}
        />
      ) : (
        <Input
          {...register(name, validationRules)}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1 poppins-regular">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => {
    console.log("Contact form data:", data);
    reset();
  };

  const contactCards = [
    {
      icon: Mail,
      title: "Email",
      content: "info@afronyanka.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+233 24 123 4567",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: (
        <div className="space-y-1">
          <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
          <p>Sat: 9:00 AM - 4:00 PM</p>
        </div>
      ),
    },
  ];

  const formFields = [
    {
      label: "Name",
      name: "name" as keyof ContactForm,
      placeholder: "Enter your name",
      required: true,
    },
    {
      label: "Email",
      name: "email" as keyof ContactForm,
      type: "email",
      placeholder: "Enter your email",
      required: true,
      validation: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      label: "Subject",
      name: "phone" as keyof ContactForm,
      placeholder: "Enter subject",
    },
    {
      label: "Message",
      name: "message" as keyof ContactForm,
      placeholder: "Write your message",
      required: true,
      rows: 4,
    },
  ];

  return (
    <section id="contact" className="py-5 md:py-10 lg:py-24 bg-[#E6E6E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl poppins-bold text-[#482B11] mb-4 lg:mb-6">
            Get in touch
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-[#6E7070] max-w-2xl mx-auto">
            Ready to start your African adventure? Contact us today!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Contact Information Cards */}
          <div className="lg:w-1/3 flex flex-col justify-between gap-6 lg:gap-0">
            {contactCards.map((card, index) => (
              <ContactCard key={index} {...card} />
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm lg:w-2/3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 lg:space-y-8"
            >
              <div className="flex flex-col gap-6">
                {formFields.slice(0, 2).map((field) => (
                  <FormField
                    key={field.name}
                    {...field}
                    errors={errors}
                    register={register}
                  />
                ))}
              </div>

              {formFields.slice(2).map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  errors={errors}
                  register={register}
                />
              ))}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#FFA75D] cursor-pointer text-base lg:text-lg poppins-medium text-[#482B11] hover:bg-[#FFA75D]/80 p-4 lg:p-5 rounded-lg transition-colors flex items-center justify-center gap-2 h-12 lg:h-14"
                >
                  Send message
                  <Mail size={20} className="lg:w-6 lg:h-6" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
