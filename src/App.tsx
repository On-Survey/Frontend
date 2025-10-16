import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Create } from "./pages/Create";
import { Home } from "./pages/Home";
import { Main } from "./pages/Main";
import { Onboarding } from "./pages/Onboarding";

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<Route path="/create" element={<Create />} />
			</Routes>
		</Router>
	);
};
