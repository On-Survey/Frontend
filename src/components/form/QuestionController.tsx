import { adaptive } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";
import {
	BUTTON_STYLES,
	ICON_PROPS,
	QUESTION_TYPES,
	TEXT_PROPS,
} from "../../constants/formController";

interface QuestionControllerProps {
	onPrevious: () => void;
}
function QuestionController({ onPrevious }: QuestionControllerProps) {
	const handlePrevious = () => {
		onPrevious();
	};

	const handleQuestionTypeClick = (questionType: string) => {
		console.log(`문항 타입 선택: ${questionType}`);
	};

	return (
		<div
			className="flex items-center gap-4 bg-white rounded-full p-2 w-full overflow-x-auto"
			style={{
				scrollbarWidth: "none",
				msOverflowStyle: "none",
				WebkitOverflowScrolling: "touch",
			}}
		>
			{/* 뒤로가기 버튼 */}
			<button
				className={BUTTON_STYLES.backButton}
				type="button"
				onClick={handlePrevious}
			>
				<Asset.Icon
					frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
					backgroundColor={ICON_PROPS.backgroundColor}
					name="icon-arrow-left-2-mono"
					color={adaptive.grey600}
					aria-hidden={ICON_PROPS.ariaHidden}
					ratio={ICON_PROPS.ratio}
				/>
			</button>

			{/* 문항 타입 버튼들 */}
			{QUESTION_TYPES.map((questionType) => (
				<button
					key={questionType.id}
					className={BUTTON_STYLES.questionType}
					type="button"
					onClick={() => handleQuestionTypeClick(questionType.id)}
				>
					<Asset.Icon
						frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
						backgroundColor={ICON_PROPS.backgroundColor}
						name={questionType.icon}
						color={adaptive.grey600}
						aria-hidden={ICON_PROPS.ariaHidden}
						ratio={ICON_PROPS.ratio}
					/>
					<Text
						color={adaptive.grey700}
						typography={TEXT_PROPS.typography}
						fontWeight={TEXT_PROPS.fontWeight}
					>
						{questionType.label}
					</Text>
				</button>
			))}
		</div>
	);
}

export default QuestionController;
