//import { Children } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { OrthographyPage,AssistantPage } from "../pages";
import { DashboardLayout } from "../layouts/DashboardLayout";

export const menuRoutes = [
    {
      to: "/orthography",
      icon: "fa-solid fa-spell-check",
      title: "Ortografía",
      description: "Corregir Ortografía",
      component: <OrthographyPage />
    },
   
    {
      to: "/assistant",
      icon: "fa-solid fa-user",
      title: "Asistente Digital",
      description: "Análisis de datos",
      component: <AssistantPage />
    },
  ];


export const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardLayout />,
        children:[
            ...menuRoutes.map( route =>({
              path: route.to,
              element: route.component
            })),
            {
                path: '',
                element: <Navigate to={menuRoutes[0].to} />
            }
        ],
    }
])