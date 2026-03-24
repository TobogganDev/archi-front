import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";

export function Providers() {
	return <RouterProvider router={router} />;
}
