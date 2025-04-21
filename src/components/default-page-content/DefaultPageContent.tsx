import { useNavigate } from "react-router";
import { ImageUrls } from "../../utils/ImageUrls";
import CustomButton from "../custom-button/CustomButton";
import style from "./DefaultPageContent.module.scss";
import { RouteConstant } from "../../utils/RouteConstant";
import { useEffect, useState } from "react";

const DefaultPageContent = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [dentalCare, setDentalCare] = useState<any[]>([]);
  const [patientCenteredCare, setPatientCenteredCare] = useState<any[]>([]);
  const onAppointmentClick = () => {
    navigate(RouteConstant.Appoinments);
  };

  useEffect(() => {
    setServices([
      {
        label: "General Dentistry",
        info: "Comprehensive care to maintain your oral health and prevent future issues.",
        card_img: ImageUrls.GeneralDentistry,
        btnLabel: "Learn More",
      },
      {
        label: "Cosmetic Dentistry",
        info: "Enhance your smile with advanced treatments tailored to your aesthetic goals.",
        card_img: ImageUrls.CosmeticDentistry,
        btnLabel: "Discover More",
      },
      {
        label: "Orthodontics",
        info: "Achieve a straighter smile with personalized orthodontic solutions for all ages.",
        card_img: ImageUrls.Orthodontics,
        btnLabel: "Find Out More",
      },
    ]);
    setDentalCare([
      {
        label: "Flexible Scheduling",
        btn_label: "Book Your Visit",
        card_img: ImageUrls.FlexibleScheduling,
      },
      {
        label: "Personalized Care",
        btn_label: "Learn More",
        card_img: ImageUrls.PersonalizedCare,
      },
      {
        label: "Preventive Focus",
        btn_label: "Discover Benifits",
        card_img: ImageUrls.PreventiveFocus,
      },
    ]);
    setPatientCenteredCare([
      {
        label: "Tailored Consultation",
        card_img: ImageUrls.TailoredConsultation,
      },
      {
        label: "Personalized Treatment",
        card_img: ImageUrls.PersonalizedTreatment,
      },
      {
        label: "Comfort In Every Step",
        card_img: ImageUrls.Comfort,
      },
      {
        label: "Satisfaction Guaranteed      ",
        card_img: ImageUrls.CustomerSatisfaction,
      },
    ]);
    console.log(dentalCare);
  }, []);

  return (
    <>
      <div className={style["first_content"] + " w-full"}>
        <div className="container h-full w-full m-auto">
          <div className="flex h-full w-full justify-center items-center">
            <div
              className={
                style.inner_content +
                " p-4 text-center flex flex-col justify-center items-center"
              }
            >
              <h3 className="text-4xl mt-2 mb-4 font-bold">
                Take your dental health{" "}
                <span className="undeline_span">Seriously !</span>
              </h3>
              <h6 className="text-base mt-2 mb-3 font-medium w-4/6">
                We offer a wide range of services for your every dental need.
              </h6>

              <CustomButton
                styleClass="mt-3 mb-3"
                icon="arrow-right"
                iconPosition="right"
                label="Book A Appointment"
                size="xl"
                onSubmitEvent={() => onAppointmentClick()}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={style.second_content + " w-full"}>
        <div className="container h-full w-full m-auto">
          <div className="flex w-full flex-wrap h-full p-0">
            <div className="max-[426px]:w-full max-[426px]:py-6 md:w-6/12 pl-4 max-[426px]:pr-4 md:pr-[5%] xl:pr-[10%] flex flex-col justify-center items-center">
              <h4 className="text-3xl text-center mt-0 mb-2 font-bold w-4/6">
                Serving Smile Since{" "}
                <span className="underline underline-offset-8">2022</span>
              </h4>
              <p className="text-sm w-4/6 font-normal my-4 text-center">
                Dr. Maria Chishty has been dedicated to providing exceptional
                dental care since 2022. As the sole practitioner of her clinic,
                she combines expertise with a personal touch, ensuring each
                patient receives individualized attention. Using the latest
                technology and a gentle approach, Dr. Maria Chishty offers a
                wide range of services, from routine check-ups to specialized
                treatments, all in a comfortable and welcoming environment.
                Trust her to care for your smile with the utmost professionalism
                and compassion.
              </p>
              <button className="styled_btn3 my-4">
                Get in touch
                <span className="pi pi-arrow-right"></span>
              </button>
            </div>
            <div
              className={style.content_2 + " max-[426px]:hidden md:w-6/12 p-0"}
            >
              <div className={style.content_bg}>
                <img
                  src={ImageUrls.dentalserve}
                  alt="Dentist Serving Image..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={style.third_content + " " + style.common_spacing + " w-full"}
      >
        <div className="container h-full w-full m-auto">
          <div className="flex flex-wrap h-full">
            <div className="max-[426px]:w-full md:w-6/12 md:px-[3%] flex flex-col justify-center items-start h-full">
              <img
                src={ImageUrls.AboutMaria}
                className={style.third_img}
                alt=""
              />
            </div>
            <div className="max-[426px]:w-full max-[426px]:py-6 max-[426px]:px-6 md:w-6/12 px-[3%] flex flex-col justify-center items-start h-full">
              <h4 className="text-3xl mt-0 mb-4">
                Meet <br />
                Dr. Maria <span className="undeline_span"> Chishty</span>
              </h4>
              <h6 className="text-xl w-4/6 font-semibold my-4 text-left">
                General Dentist
              </h6>
              <p className="text-base font-normal my-2 text-left">
                Dr. Maria Chishty is committed to providing high-quality and
                affordable dental care to patients of all ages. She believes in
                a personalized approach and always makes sure her clients
                understand and are comfortable with their treatment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          style.fourth_content + " " + style.common_spacing + " w-full"
        }
      >
        <div className="container h-full w-full m-auto">
          <div className="text-center w-full h-full">
            <h4 className="text-3xl text-center mt-0 mb-5 font-bold">
              Comprehensive Dental Services
            </h4>
            <h6 className="text-xl mt-0 mb-6 font-semibold px-[15%]">
              Explore our diverse range of dental treatments designed to meet
              your unique needs and preferences.
            </h6>
            <div
              className={
                style.service_card_content +
                " w-full gap-8 grid max-[426px]:grid-cols-1 grid-cols-3"
              }
            >
              {services.map((service) => (
                <>
                  <div
                    className={
                      style.service_card +
                      " card bg-lime-50 rounded-md hover:bg-lime-100 hover:rounded-xl transition overflow-hidden"
                    }
                    key={service.label}
                  >
                    <div className={style.card_img}>
                      <img
                        className="transition"
                        src={service.card_img}
                        alt={service.label + "info"}
                      />
                    </div>
                    <div className={style["card_content"] + " text-left"}>
                      <h5 className="text-lg font-semibold mt-0 mb-3">
                        {service.label}
                      </h5>
                      <p className="text-sm font-medium mt-0 mb-4">
                        {service?.info}
                      </p>
                      <button className="styled_btn1 my-2">
                        <span>{service?.btnLabel}</span>
                        <i className="pi pi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={style.fifth_content + " " + style.common_spacing + " w-full"}
      >
        <div className="container h-full w-full m-auto">
          <div className="text-center w-full h-full">
            <h4 className="text-3xl mt-0 mb-5 font-bold text-gray-100">
              Compassionate and <br/> Personalized Patient-Centered Care
            </h4>

            <h6 className="text-xl font-semibold mt-0 max-[426px]:mb-4 mb-6 text-gray-200">
              Your Comfort, Well-being, and Satisfaction Are Our Top Priorities
            </h6>
          </div>
          <div
            className={
              style.service_card_content +
              " w-full py-8 lg:py-12 grid max-[426px]:grid-cols-1 grid-cols-2 max-[426px]:gap-4 md:gap-8 lg:gap-12"
            }
          >
            {patientCenteredCare.map((care) => (
              <>
                <div
                  className={
                    style.content_card +
                    " card transition relative overflow-hidden rounded-xl hover:rounded-2xl hover:translate-y-[-0.5rem] "
                  }
                  style={{
                    backgroundImage: `url(${care.card_img})`,
                  }}
                >
                  <h6 className="m-0">{care?.label}</h6>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultPageContent;
