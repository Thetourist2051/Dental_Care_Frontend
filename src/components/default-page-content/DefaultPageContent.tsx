import { ImageUrls } from "../../utils/ImageUrls";
import CustomButton from "../custom-button/CustomButton";
import style from "./DefaultPageContent.module.scss";

type Props = {};

const DefaultPageContent = (props: Props) => {
  console.log(props);
  const onAppointmentClick = () => {
    console.log("On Appoinment button click");
  };

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
              <h3 className="text-4xl mt-2 mb-4 font-bold w-5/6">
                Take your dental health{" "}
                <span className="underline underline-offset-8">seriously</span>
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
          <div className="flex w-full h-full p-0">
            <div className="md:w-7/12 sm:w-full flex flex-col justify-center items-center pl-4 pr-[10%] py-4">
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
              <div
                role="button"
                className="theme_button flex justify-center items-center cursor-pointer my-4"
              >
                <label className="pr-2 font-medium cursor-pointer">
                  My Services
                </label>
                <span className="material-symbols-rounded font-normal">
                  arrow_circle_right
                </span>
              </div>
            </div>
            <div className={style.content_2 + " md:w-5/12 sm:w-full p-0"}>
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
      <div className={style.third_content + " w-full"}>
        <div className="container h-full w-full m-auto">
          <div className="flex flex-wrap h-full">
            <div className="md:w-6/12 sm:w-full px-[5%] border flex flex-col justify-center items-start p-4">
              <h4 className="text-3xl mt-0 mb-4">
                Meet <br />
                Dr. Maria{" "}
                <span className="undeline_span"> Chishty</span>
              </h4>
              <h6 className="text-xl w-4/6 font-semibold my-4 text-left">
                General Dentist
              </h6>
              <p className="text-base font-normal my-2 text-left" >
                Dr. Maria Chishty is committed to providing high-quality and
                affordable dental care to patients of all ages. She believes in
                a personalized approach and always makes sure her clients
                understand and are comfortable with their treatment.
              </p>
            </div>
            <div className="w-6/12"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultPageContent;
