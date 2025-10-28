import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Create } from "./pages/Create";
import { Home } from "./pages/Home";
import { Intro } from "./pages/Intro";
import { Main } from "./pages/Main";
import { MySurvey } from "./pages/mysurvey";
import { Onboarding } from "./pages/Onboarding";
import { OXquiz } from "./pages/OXquiz";
import { OXquizDetail } from "./pages/OXquizDetail";
import { Survey } from "./pages/Survey";

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Intro />} />
				<Route path="/home" element={<Home />} />
				<Route path="/onboarding" element={<Onboarding />} />
				<Route path="/main" element={<Main />} />
				<Route path="/create" element={<Create />} />
				<Route path="/mysurvey" element={<MySurvey />} />
				<Route path="/OXquiz" element={<OXquiz />} />
				<Route path="/oxquiz-detail" element={<OXquizDetail />} />
				<Route path="/survey" element={<Survey />} />
			</Routes>
		</Router>
	);
};
