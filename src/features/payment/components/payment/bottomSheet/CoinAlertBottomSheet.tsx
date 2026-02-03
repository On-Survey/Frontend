import { useMultiStep } from "@shared/contexts/MultiStepContext";
import { useSurvey } from "@shared/contexts/SurveyContext";
import { pushGtmEvent } from "@shared/lib/gtm";
import { Asset, BottomSheet, Button } from "@toss/tds-mobile";
import { useLocation } from "react-router-dom";

interface CoinAlertBottomSheetProps {
	isOpen: boolean;
	handleClose: () => void;
}

export const CoinAlertBottomSheet = ({
	isOpen,
	handleClose,
}: CoinAlertBottomSheetProps) => {
	const { goNextPayment } = useMultiStep();
	const { state } = useSurvey();
	const location = useLocation();

	const locationState = location.state as
		| { source?: "main_cta" | "mysurvey_button" | "mysurvey_edit" }
		| undefined;

	const handleCloseClick = () => {
		const source = locationState?.source ?? "main_cta";
		const entryType = state.screening.enabled
			? "screening_complete"
			: "screening_skip";

		pushGtmEvent({
			event: "coin_charge_prompt_action",
			pagePath: "/createForm",
			...(state.surveyId && { survey_id: String(state.surveyId) }),
			step: "decision",
			action: "close",
			source,
			entry_type: entryType,
		});

		handleClose();
	};

	const handleNextPayment = () => {
		const source = locationState?.source ?? "main_cta";
		const entryType = state.screening.enabled
			? "screening_complete"
			: "screening_skip";

		pushGtmEvent({
			event: "coin_charge_prompt_action",
			pagePath: "/createForm",
			...(state.surveyId && { survey_id: String(state.surveyId) }),
			step: "decision",
			action: "charge",
			source,
			entry_type: entryType,
		});

		goNextPayment();
		handleClose();
	};

	return (
		<BottomSheet
			header={<BottomSheet.Header>보유 코인이 부족해요</BottomSheet.Header>}
			headerDescription={
				<BottomSheet.HeaderDescription>
					설문 등록을 위해 코인을 충전할게요
				</BottomSheet.HeaderDescription>
			}
			open={isOpen}
			onClose={handleClose}
			cta={
				<BottomSheet.DoubleCTA
					leftButton={
						<Button color="dark" variant="weak" onClick={handleCloseClick}>
							닫기
						</Button>
					}
					rightButton={
						<Button
							onClick={handleNextPayment}
							style={
								{
									"--button-background-color": "#15c67f",
								} as React.CSSProperties
							}
						>
							충전하기
						</Button>
					}
				/>
			}
		>
			<div className="h-4" />
			<div className="flex justify-center items-center">
				<Asset.Icon
					frameShape={{ width: 100 }}
					name="icon-coin-yellow"
					aria-hidden={true}
				/>
			</div>
		</BottomSheet>
	);
};
