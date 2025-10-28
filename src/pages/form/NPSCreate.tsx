import { BottomSheet, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "../../contexts/SurveyContext";
import type { NPSQuestion } from "../../types/survey";

function NPSCreate() {
	const navigate = useNavigate();
	const { addQuestion } = useSurvey();
	const [title, setTitle] = useState("");
	const [scale, setScale] = useState(10);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setScale(parseInt(e.target.value) || 10);
	};

	const handleConfirm = () => {
		if (title.trim()) {
			const newQuestion: NPSQuestion = {
				id: crypto.randomUUID(),
				type: "nps",
				title: title.trim(),
				required: true,
				order: 0, // addQuestion에서 자동으로 설정됨
				scale,
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
					<BottomSheet.Header>NPS 문항을 생성해주세요</BottomSheet.Header>
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

					<div className="text-sm text-gray-600">
						<p>
							NPS (Net Promoter Score)는 고객이 제품이나 서비스를 다른 사람에게
							추천할 의향을 묻는 질문입니다.
						</p>
						<p>0점: 전혀 추천하지 않음</p>
						<p>10점: 매우 추천함</p>
					</div>
				</div>
			</BottomSheet>
		</div>
	);
}

export default NPSCreate;
