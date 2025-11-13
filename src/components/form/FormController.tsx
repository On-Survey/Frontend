import { adaptive } from "@toss/tds-colors";
import { Asset, ConfirmDialog, Text, useToast } from "@toss/tds-mobile";
import { useState } from "react";
import {
	BUTTON_STYLES,
	ICON_PROPS,
	MAIN_CONTROLS,
	TEXT_PROPS,
} from "../../constants/formController";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { createSurveyQuestion, saveAsDraft } from "../../service/form";
import {
	isDateQuestion,
	isLongAnswerQuestion,
	isMultipleChoiceQuestion,
	isNPSQuestion,
	isNumberQuestion,
	isRatingQuestion,
	isShortAnswerQuestion,
} from "../../types/survey";
import { QuestionController } from "./QuestionController";

export const FormController = () => {
	const { handleStepChange } = useMultiStep();
	const { setScreeningEnabled, state } = useSurvey();

	const [isOpen, setIsOpen] = useState(false);

	const { openToast } = useToast();

	const {
		isOpen: isConfirmDialogOpen,
		handleOpen: handleConfirmDialogOpen,
		handleClose: handleConfirmDialogClose,
	} = useModal(false);

	const handleSaveAndIsConfirmDialogOpen = async () => {
		// if (state.survey.question.length === 0) {
		// 	openToast("문항을 추가해주세요.", {
		// 		type: "bottom",
		// 		lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
		// 		higherThanCTA: true,
		// 	});
		// 	return;
		// }
		// const result = await createSurveyQuestion({
		// 	surveyId: state.surveyId ?? 0,
		// 	info: {
		// 		multipleChoice: state.survey.question.filter(isMultipleChoiceQuestion),
		// 		rating: state.survey.question.filter(isRatingQuestion),
		// 		nps: state.survey.question.filter(isNPSQuestion),
		// 		shortAnswer: state.survey.question.filter(isShortAnswerQuestion),
		// 		longAnswer: state.survey.question.filter(isLongAnswerQuestion),
		// 		date: state.survey.question.filter(isDateQuestion),
		// 		number: state.survey.question.filter(isNumberQuestion),
		// 	},
		// });
		// if (result.success) {
		// 	handleConfirmDialogOpen();
		// }
		handleConfirmDialogOpen();
	};

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleSave = async () => {
		const result = await saveAsDraft({
			surveyId: state.surveyId ?? 0,
			info: {
				multipleChoice: state.survey.question.filter(isMultipleChoiceQuestion),
				rating: state.survey.question.filter(isRatingQuestion),
				nps: state.survey.question.filter(isNPSQuestion),
				shortAnswer: state.survey.question.filter(isShortAnswerQuestion),
				longAnswer: state.survey.question.filter(isLongAnswerQuestion),
				date: state.survey.question.filter(isDateQuestion),
				number: state.survey.question.filter(isNumberQuestion),
			},
		});
		if (result.success) {
			openToast("임시 저장됐어요.", {
				type: "bottom",
				lottie: "https://static.toss.im/lotties-common/check-green-spot.json",
				higherThanCTA: true,
			});
		}
	};

	const handleAddQuestion = () => {
		handleOpen();
	};

	const handleReorderQuestion = () => {
		console.log("순서 변경");
	};

	const handleNext = () => {
		handleStepChange(2);
	};

	const handleSkip = () => {
		handleStepChange(3);
		handleConfirmDialogClose();
	};

	const handleDialogConfirm = () => {
		setScreeningEnabled(true);
		handleNext();
		handleConfirmDialogClose();
	};

	const handleDialogCancel = () => {
		handleConfirmDialogClose();
	};

	// 액션 핸들러 매핑
	const actionHandlers = {
		handleSave,
		handleAddQuestion,
		handleReorderQuestion,
	};

	return (
		<>
			<ConfirmDialog
				open={isConfirmDialogOpen}
				onClose={handleDialogCancel}
				cancelButton={
					<ConfirmDialog.CancelButton size="xlarge" onClick={handleSkip}>
						건너뛰기
					</ConfirmDialog.CancelButton>
				}
				confirmButton={
					<ConfirmDialog.ConfirmButton
						size="xlarge"
						onClick={handleDialogConfirm}
					>
						추가하기
					</ConfirmDialog.ConfirmButton>
				}
				title="스크리닝 질문을 추가할까요?"
				description="스크리닝 질문이란 설문에 참여할 적합한 사람을 미리 선별하기 위한 OX 질문이에요."
			/>
			<div className="fixed bottom-1 left-0 right-0 z-50 bg-gray-100 px-2 pt-2 pb-6">
				<div className="flex items-center gap-2 w-full justify-between">
					<div className="relative flex-1 overflow-hidden h-[60px]">
						{/* QuestionController - 왼쪽에서 슬라이드 인 */}
						<div
							className={`absolute inset-0 transition-all duration-300 ease-out ${
								isOpen
									? "opacity-100 translate-x-0 z-20"
									: "opacity-0 -translate-x-full z-0"
							}`}
						>
							{isOpen && (
								<div className="animate-slide-in-left">
									<QuestionController onPrevious={handleClose} />
								</div>
							)}
						</div>

						{/* 기본 컨트롤들 - 오른쪽으로 슬라이드 아웃 */}
						<div
							className={`absolute inset-0 transition-all duration-300 ease-out ${
								!isOpen
									? "opacity-100 translate-x-0 z-20"
									: "opacity-0 translate-x-full z-0 pointer-events-none"
							}`}
						>
							{!isOpen && (
								<div className="animate-slide-in-right">
									<div className="flex items-center gap-2 w-full justify-between">
										<div className="flex items-center gap-10 bg-white rounded-full p-2 w-full justify-center">
											{MAIN_CONTROLS.map((control) => (
												<button
													key={control.id}
													className={BUTTON_STYLES.mainControl}
													onClick={actionHandlers[control.action]}
													type="button"
												>
													<Asset.Icon
														frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
														backgroundColor={ICON_PROPS.backgroundColor}
														name={control.icon}
														color={adaptive.grey600}
														aria-hidden={ICON_PROPS.ariaHidden}
														ratio={ICON_PROPS.ratio}
													/>
													<Text
														color={adaptive.grey700}
														typography={TEXT_PROPS.typography}
														fontWeight={TEXT_PROPS.fontWeight}
													>
														{control.label}
													</Text>
												</button>
											))}
										</div>
										<button
											className={BUTTON_STYLES.nextButton}
											type="button"
											onClick={handleSaveAndIsConfirmDialogOpen}
										>
											<Asset.Icon
												frameShape={Asset.frameShape[ICON_PROPS.frameShape]}
												backgroundColor={ICON_PROPS.backgroundColor}
												name="icon-arrow-left-big-mono"
												color={adaptive.background}
												aria-hidden={ICON_PROPS.ariaHidden}
												ratio={ICON_PROPS.ratio}
											/>
											<Text
												color={adaptive.background}
												typography={TEXT_PROPS.typography}
												fontWeight={TEXT_PROPS.fontWeight}
											>
												다음
											</Text>
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
