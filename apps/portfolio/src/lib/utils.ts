import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createContext } from "react"

import PROJECTS_DATA from "@/components/AppData/projects"
import ABOUT_DATA from "@/components/AppData/about"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ProjectsContext = createContext(PROJECTS_DATA);
export const AboutContext = createContext(ABOUT_DATA);