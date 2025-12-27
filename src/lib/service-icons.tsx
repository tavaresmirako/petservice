import { Dog, Scissors, Stethoscope, Home, GraduationCap, LucideIcon } from "lucide-react";

interface ServiceIconMap {
  [key: string]: {
    icon: LucideIcon;
    label: string;
  };
}

export const serviceIconMap: ServiceIconMap = {
  dog_walker: {
    icon: Dog,
    label: "Passeador de Cães",
  },
  grooming: {
    icon: Scissors,
    label: "Banho e Tosa",
  },
  veterinarian: {
    icon: Stethoscope,
    label: "Veterinário",
  },
  boarding: {
    icon: Home,
    label: "Hospedagem",
  },
  training: {
    icon: GraduationCap,
    label: "Treinamento",
  },
};

export const serviceTypes = Object.keys(serviceIconMap);
