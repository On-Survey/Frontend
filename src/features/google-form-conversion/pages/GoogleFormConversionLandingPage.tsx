import { pushGtmEvent } from "@shared/lib/gtm";
import { FixedBottomCTA } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import landing1 from "../../../assets/landingPage/landing1.svg";
import landing2 from "../../../assets/landingPage/landing2.svg";
import landing3 from "../../../assets/landingPage/landing3.svg";
import landing4 from "../../../assets/landingPage/landing4.svg";
import landing5 from "../../../assets/landingPage/landing5.svg";

export const GoogleFormConversionLandingPage = () => {
	const navigate = useNavigate();

	const handleRegister = () => {
		pushGtmEvent({
			event: "form_convert_button_click",
			pagePath: "/google-form-conversion-landing",
		});
		navigate("/payment/google-form-conversion");
	};

	return (
		<>
			<div className="flex flex-col min-h-screen">
				<img src={landing1} alt="랜딩 페이지 1" className="w-full h-auto" />
				<img src={landing2} alt="랜딩 페이지 2" className="w-full h-auto" />
				<img src={landing3} alt="랜딩 페이지 3" className="w-full h-auto" />
				<img src={landing4} alt="랜딩 페이지 4" className="w-full h-auto" />
				<img src={landing5} alt="랜딩 페이지 5" className="w-full h-auto" />
			</div>

			<FixedBottomCTA loading={false} onClick={handleRegister}>
				설문 등록하기
			</FixedBottomCTA>
		</>
	);
};
