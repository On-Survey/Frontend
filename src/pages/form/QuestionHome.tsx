import { adaptive } from "@toss/tds-colors";
import { Border, Top } from "@toss/tds-mobile";
import { useSurvey } from "../../contexts/SurveyContext";

interface QuestionHomeProps {
	onPrevious: () => void;
}

function QuestionHome({ onPrevious }: QuestionHomeProps) {
	const { state } = useSurvey();
	const handlePrevious = () => {
		onPrevious();
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{state.formData.title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						{state.formData.description}
					</Top.SubtitleParagraph>
				}
				lower={
					<Top.LowerButton
						color="dark"
						size="small"
						variant="weak"
						display="inline"
						onClick={handlePrevious}
					>
						시작 정보 수정하기
					</Top.LowerButton>
				}
			/>
			<Border variant="height16" />
			<div className="h-3" />
		</>
	);
}

export default QuestionHome;
