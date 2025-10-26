import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SurveyProvider } from "./contexts/SurveyContext";
import { Create } from "./pages/Create";
import { Home } from "./pages/Home";
import { Intro } from "./pages/Intro";
import { Main } from "./pages/Main";
import { Onboarding } from "./pages/Onboarding";
import { OXquiz } from "./pages/OXquiz";

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Intro />} />
				<Route path="/home" element={<Home />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<SurveyProvider>
					<Route path="/create" element={<Create />} />
				</SurveyProvider>
				<Route path="/OXquiz" element={<OXquiz />} />
			</Routes>
		</Router>
	);
};
