import { pushGtmEvent } from "@shared/lib/gtm";
import { adaptive } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";
import formBanner from "../../../assets/formBanner.png";

export const GoogleFormCreateSurveyBanner = () => {
	const navigate = useNavigate();

	const handleCreateSurvey = () => {
		pushGtmEvent({
			event: "main_banner_click",
			pagePath: "/home",
			source: "home_ad_main",
		});
		navigate("/google-form-conversion-landing", {
			state: { source: "main_cta" },
		});
	};

	return (
		<div className="px-4">
			<div className="bg-gray-50 rounded-[24px] flex items-center justify-between gap-4">
				<button
					type="button"
					onClick={handleCreateSurvey}
					className="flex-1 p-4 text-left"
				>
					<div className="flex flex-col items-start gap-1">
						<Text color={adaptive.grey800} typography="t5" fontWeight="bold">
							구글폼으로 설문 등록하기
						</Text>
						<Text color={adaptive.grey600} typography="t7" fontWeight="regular">
							등록만 하면 패널에게 즉시 노출
						</Text>
					</div>
				</button>
				<img
					src={formBanner}
					alt="구글폼 배너"
					className="h-full max-h-[84px] w-auto object-contain"
				/>
			</div>
		</div>
	);
};
