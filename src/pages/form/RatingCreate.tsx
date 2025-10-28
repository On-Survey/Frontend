import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import type { RatingQuestion } from "../../types/survey";

function RatingCreate() {
	const navigate = useNavigate();
	const { addQuestion } = useSurvey();
	const [title, setTitle] = useState("");
	const [leftLabel, setLeftLabel] = useState("매우 나쁨");
	const [rightLabel, setRightLabel] = useState("매우 좋음");
	const [scale, setScale] = useState(10);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleLeftLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLeftLabel(e.target.value);
	};

	const handleRightLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRightLabel(e.target.value);
	};

	const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setScale(parseInt(e.target.value) || 10);
	};

	const handleConfirm = () => {
		if (title.trim()) {
			const newQuestion: RatingQuestion = {
				id: crypto.randomUUID(),
				type: "rating",
				title: title.trim(),
				required: true,
				order: 0, // addQuestion에서 자동으로 설정됨
				config: {
					leftLabel,
					rightLabel,
					scale,
				},
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
							label="왼쪽 라벨"
							labelOption="sustain"
							value={leftLabel}
							onChange={handleLeftLabelChange}
							placeholder="왼쪽 라벨"
						/>
						<TextField.Clearable
							variant="line"
							hasError={false}
							label="오른쪽 라벨"
							labelOption="sustain"
							value={rightLabel}
							onChange={handleRightLabelChange}
							placeholder="오른쪽 라벨"
						/>
					</div>

					<TextField.Clearable
						variant="line"
						hasError={false}
						label="스케일 (1-10)"
						labelOption="sustain"
						type="number"
						value={scale.toString()}
						onChange={handleScaleChange}
						placeholder="10"
					/>
				</div>
			</BottomSheet>
		</div>
	);
}

export default RatingCreate;
