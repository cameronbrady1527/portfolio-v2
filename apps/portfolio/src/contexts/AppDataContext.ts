import { createContext } from "react"

import PROJECTS_DATA from "@/components/AppData/projects"
import ABOUT_DATA from "@/components/AppData/about"

export const ProjectsContext = createContext(PROJECTS_DATA);
export const AboutContext = createContext(ABOUT_DATA);
