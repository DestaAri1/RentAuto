import { Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: Role;
}

export interface Role{
  id: number;
  name:string;
}

// Define the context state type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

// Register data type
export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  // Add other registration fields as needed
}

export interface HomePageProps {
  variants?: Variants;
  insideVariants?: Variants;
  cars?: Cars[];
  isVisible?: Record<string, boolean>;
  hiw?: HIW[];
  testimonials?: Testimonials[];
}

export interface Cars {
  id: number;
  name: string;
  image: string;
  price: number;
  type: string;
  seats: number;
  rating: number;
}

interface HIW {
  id: number;
  title: string;
  description: Text;
  icon: LucideIcon;
}

interface Testimonials {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}
