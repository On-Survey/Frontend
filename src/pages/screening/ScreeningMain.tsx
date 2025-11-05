import { useState } from "react";
import { useMultiStep } from "../../contexts/MultiStepContext";
import ScreeningOption from "./ScreeningOption";
import ScreeningQuestion from "./ScreeningQuestion";
import ScreeningSuccess from "./ScreeningSuccess";

function ScreeningMain() {
	const { screeningStep } = useMultiStep();
	const [question, setQuestion] = useState("");
	const [selected, setSelected] = useState<"O" | "X" | null>(null);

	const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuestion(e.target.value);
	};

	const handleSelectedChange = (selected: "O" | "X") => {
		setSelected(selected);
	};

	return (
		<>
			{screeningStep === 0 && (
				<ScreeningQuestion
					question={question}
					handleQuestionChange={handleQuestionChange}
				/>
			)}
			{screeningStep === 1 && (
				<ScreeningOption
					selected={selected}
					handleSelectedChange={handleSelectedChange}
				/>
			)}
			{screeningStep === 2 && (
				<ScreeningSuccess
					question={question}
					selected={selected ?? ("" as "O" | "X")}
				/>
			)}
		</>
	);
}

export default ScreeningMain;
