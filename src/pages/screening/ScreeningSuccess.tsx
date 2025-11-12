import { graniteEvent } from "@apps-in-toss/web-framework";
import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, Text, Top } from "@toss/tds-mobile";
import { useEffect } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";

export const ScreeningSuccess = () => {
	const { handleStepChange, goPrevScreening } = useMultiStep();
	const { state } = useSurvey();
	const question = state.screening.question;
	const selected = state.screening.answerType;

	useEffect(() => {
		const unsubscription = graniteEvent.addEventListener("backEvent", {
			onEvent: () => {
				goPrevScreening();
			},
			onError: (error) => {
				alert(`에러가 발생했어요: ${error}`);
			},
		});

		return unsubscription;
	}, [goPrevScreening]);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						스크리닝 설문 구성 완료!
					</Top.TitleParagraph>
				}
			/>
			<Asset.Icon
				frameShape={Asset.frameShape.CleanW100}
				backgroundColor="transparent"
				name="icon-emoji-party-popper"
				ratio="1/1"
			/>

			<div className="h-4" />
			<Text
				color={adaptive.grey800}
				typography="t5"
				fontWeight="semibold"
				textAlign="center"
			>
				{question && selected
					? `[${question}] 질문에 대해 ${selected} 선택을 한 타겟만 이 설문에 참여할 수 있어요`
					: "스크리닝 설문이 구성되었습니다."}
			</Text>
			<FixedBottomCTA loading={false} onClick={() => handleStepChange(3)}>
				다음
			</FixedBottomCTA>
		</>
	);
};
