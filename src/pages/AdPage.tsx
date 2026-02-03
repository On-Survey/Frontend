import { FixedBottomCTA } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import ad1 from "../assets/adPage/ad1.svg";
import ad2 from "../assets/adPage/ad2.svg";
import ad3 from "../assets/adPage/ad3.svg";
import ad4 from "../assets/adPage/ad4.svg";
import ad5 from "../assets/adPage/ad5.svg";
import landing4 from "../assets/landingPage/landing4.svg";
import { pushGtmEvent } from "../utils/gtm";

export const AdPage = () => {
	const navigate = useNavigate();

	const handleMoveToOnsurvey = () => {
		pushGtmEvent({
			event: "landing_button_click",
			pagePath: "/ad",
		});
		navigate("/");
	};

	return (
		<>
			<div className="flex flex-col min-h-screen pb-28">
				<img src={ad1} alt="홈광고 1" className="w-full h-auto" />
				<img src={ad2} alt="홈광고 2" className="w-full h-auto" />
				<img src={ad3} alt="홈광고 3" className="w-full h-auto" />
				<img src={ad4} alt="홈광고 4" className="w-full h-auto" />
				<img src={ad5} alt="홈광고 5" className="w-full h-auto" />
				<img src={landing4} alt="랜딩 페이지 4" className="w-full h-auto" />
			</div>

			<FixedBottomCTA loading={false} onClick={handleMoveToOnsurvey}>
				온서베이 이동하기
			</FixedBottomCTA>
		</>
	);
};
