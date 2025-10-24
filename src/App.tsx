import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Create } from "./pages/Create";
import { Intro } from "./pages/Intro";
import { Main } from "./pages/Main";
import { Onboarding } from "./pages/Onboarding";
import { OXquiz } from "./pages/OXquiz";

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Intro />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<Route path="/create" element={<Create />} />
				<Route path="/OXquiz" element={<OXquiz />} />
			</Routes>
		</Router>
	);
};
