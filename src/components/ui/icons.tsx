import {
  Loader2,
  LogIn,
  LogOut,
  Menu,
  Moon,
  MoreVertical,
  Plus,
  Settings,
  SunMedium,
  Trash,
  User,
  X,
  LucideProps,
  Laptop,
} from "lucide-react"

export const Icons = {
  logo: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  ),
  close: X,
  spinner: Loader2,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  login: LogIn,
  logout: LogOut,
  settings: Settings,
  user: User,
  menu: Menu,
  add: Plus,
  more: MoreVertical,
  delete: Trash,
}
