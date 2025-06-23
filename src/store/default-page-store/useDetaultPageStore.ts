import { create } from "zustand";
import { ImageUrls } from "../../utils/ImageUrls";

interface DentalService {
  label: string;
  description: string;
  readonly cardImage: string;
  readonly buttonLabel: string;
}

interface DentalCare {
  label: string;
  readonly cardImage: string;
  readonly buttonLabel: string;
}

interface PatientCentricCare {
  label: string;
  readonly cardImage: string;
}

interface DefaultPageStoreState {
  dentalServices: DentalService[];
  dentalCareOptions: DentalCare[];
  patientCentricCares: PatientCentricCare[];
  setDentalServices: () => void;
}

const DEFAULT_DENTAL_SERVICES: DentalService[] = [
  {
    label: "General Dentistry",
    description:
      "Comprehensive care to maintain your oral health and prevent future issues.",
    cardImage: ImageUrls.GeneralDentistry,
    buttonLabel: "Learn More",
  },
  {
    label: "Cosmetic Dentistry",
    description:
      "Enhance your smile with advanced treatments tailored to your aesthetic goals.",
    cardImage: ImageUrls.CosmeticDentistry,
    buttonLabel: "Discover More",
  },
  {
    label: "Orthodontics",
    description:
      "Achieve a straighter smile with personalized orthodontic solutions for all ages.",
    cardImage: ImageUrls.Orthodontics,
    buttonLabel: "Find Out More",
  },
];

const DEFAULT_DENTAL_CARE_OPTIONS: DentalCare[] = [
  {
    label: "Flexible Scheduling",
    buttonLabel: "Book Your Visit",
    cardImage: ImageUrls.FlexibleScheduling,
  },
  {
    label: "Personalized Care",
    buttonLabel: "Learn More",
    cardImage: ImageUrls.PersonalizedCare,
  },
  {
    label: "Preventive Focus",
    buttonLabel: "Discover Benefits",
    cardImage: ImageUrls.PreventiveFocus,
  },
];

const DEFAULT_PATIENT_CENTRIC_CARES: PatientCentricCare[] = [
  {
    label: "Tailored Consultation",
    cardImage: ImageUrls.TailoredConsultation,
  },
  {
    label: "Personalized Treatment",
    cardImage: ImageUrls.PersonalizedTreatment,
  },
  {
    label: "Comfort In Every Step",
    cardImage: ImageUrls.Comfort,
  },
  {
    label: "Satisfaction Guaranteed",
    cardImage: ImageUrls.CustomerSatisfaction,
  },
];

const API_KEY = import.meta.env.VITE_OPEN_ROUTER_API_KEY;
console.log(API_KEY);

export const useDefaultPageStore = create<DefaultPageStoreState>((set) => ({
  dentalServices: DEFAULT_DENTAL_SERVICES,
  dentalCareOptions: DEFAULT_DENTAL_CARE_OPTIONS,
  patientCentricCares: DEFAULT_PATIENT_CENTRIC_CARES,
  setDentalServices: async () => {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer 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`,
            "HTTP-Referer": "",
            "X-Title": "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
              {
                role: "user",
                content: `Modify label and description of ${JSON.stringify(
                  DEFAULT_DENTAL_SERVICES
                )} with interface of that same interface. 
                Return ONLY the array in JSON format, without any additional text, explanations, or code blocks. 
                The response should be parseable as JSON directly.`,
              },
            ],
          }),
        }
      );


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0].message.content;

      console.log("responseContent",responseContent)
      // Try to extract JSON from code blocks if present
      const jsonMatch = responseContent.match(/\[.*\]/s);
      const jsonString = jsonMatch ? jsonMatch[0] : responseContent;

      // Parse the JSON
      const servicesArray = JSON.parse(jsonString);
      console.log('servicesArray',servicesArray)
      set({dentalServices: servicesArray})
      return servicesArray;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },
}));
