import { GoogleFormConversionProvider } from "@features/google-form-conversion/context/GoogleFormConversionContext";
import { Outlet } from "react-router-dom";

export function GoogleFormConversionProviderLayout() {
	return (
		<GoogleFormConversionProvider>
			<Outlet />
		</GoogleFormConversionProvider>
	);
}
