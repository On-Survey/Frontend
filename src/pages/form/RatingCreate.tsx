import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import type { RatingQuestion } from "../../types/survey";

export const RatingCreate = () => {
	const navigate = useNavigate();
	const { addQuestion } = useSurvey();
	const [title, setTitle] = useState("");
	const [minValue, setMinValue] = useState("매우 나쁨");
	const [maxValue, setMaxValue] = useState("매우 좋음");

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMinValue(e.target.value);
	};

	const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMaxValue(e.target.value);
	};

	const handleConfirm = () => {
		if (title.trim()) {
			const newQuestion: RatingQuestion = {
				surveyId: 0,
				questionId: Date.now(),
				type: "rating",
				title: title.trim(),
				description: "",
				isRequired: true,
				questionOrder: 0, // addQuestion에서 자동으로 설정됨
				minValue,
				maxValue,
			};
			addQuestion(newQuestion);
			navigate("/form");
		}
	};

	const handleClose = () => {
		navigate("/form");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<BottomSheet
				header={
					<BottomSheet.Header>평가형 문항을 생성해주세요</BottomSheet.Header>
				}
				open={true}
				onClose={handleClose}
				hasTextField={true}
				cta={
					<BottomSheet.CTA
						color="primary"
						variant="fill"
						disabled={!title.trim()}
						onClick={handleConfirm}
					>
						확인
					</BottomSheet.CTA>
				}
				ctaContentGap={0}
			>
				<div className="space-y-4">
					<TextField.Clearable
						variant="line"
						hasError={false}
						label="문항 제목"
						labelOption="sustain"
						value={title}
						onChange={handleTitleChange}
						placeholder="질문을 입력해주세요"
						autoFocus={true}
					/>

					<div className="grid grid-cols-2 gap-4">
						<TextField.Clearable
							variant="line"
							hasError={false}
							label="최소값 라벨"
							labelOption="sustain"
							value={minValue}
							onChange={handleMinValueChange}
							placeholder="최소값 라벨"
						/>
						<TextField.Clearable
							variant="line"
							hasError={false}
							label="최대값 라벨"
							labelOption="sustain"
							value={maxValue}
							onChange={handleMaxValueChange}
							placeholder="최대값 라벨"
						/>
					</div>
				</div>
			</BottomSheet>
		</div>
	);
};
