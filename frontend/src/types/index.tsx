import { Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ChildProps {
  children: ReactNode;
}

export interface ModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  onStatus?: (data: T) => void;
  onUpdate?: (data: T) => void;
  onDelete?: (data: T) => void;
}

// Define user type
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
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
  id: string;
  name: string;
  slug: string;
  price: number;
  type_id: string;
  type_name?: string; // For display purposes
  seats: number;
  unit: number;
  rating: number;
  image_url?: string;
  Type: CarType;
  available: number;
}

export interface CarsProps {
  cars: Cars[];
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

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavItemProps {
  navItem: NavItem[];
}

export interface SideBarProps {
  sidebarOpen?: boolean;
  setSidebarOpen: (value: boolean) => void;
}

interface Crumb {
  name: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  breadcrumb: Crumb[];
  actionButton?: React.ReactNode;
}

interface AvailableCars {
  id: number;
  name: string;
  type: string;
  availability: string;
  price: number;
}

export interface AvailableCarsProps {
  availableCars: AvailableCars[];
}

export interface CarType {
  id: string;
  name: string;
}

export interface CarTypesProps {
  carTypes: CarType[];
}

export interface CarChild {
  id: string;
  name: string;
  alias: string;
  image_url: string;
  slug: string;
  status: number;
  color: string;
  carParent: Cars;
  description: string;
  is_active: boolean;
  Parent: {
    id: string;
    name: string;
  };
}

export interface CarChildProps {
  carChild: CarChild[];
}
