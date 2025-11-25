import { adaptive } from "@toss/tds-colors";
import {
	Border,
	ConfirmDialog,
	IconButton,
	List,
	ListRow,
	Text,
	Top,
} from "@toss/tds-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormController } from "../../components/form/FormController";
import { QUESTION_TYPE_ROUTES } from "../../constants/routes";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useSurvey } from "../../contexts/SurveyContext";
import { useModal } from "../../hooks/UseToggle";
import { useBackEventListener } from "../../hooks/useBackEventListener";
import {
	formatQuestionNumber,
	getQuestionTypeLabel,
} from "../../utils/questionFactory";

export const QuestionHome = () => {
	const [isReorderMode, setIsReorderMode] = useState(false);
	const [displayOrderMap, setDisplayOrderMap] = useState<
		Record<number, number>
	>({});
	const hasInitializedDisplayOrder = useRef(false);
	const { state, deleteQuestion, reorderQuestions } = useSurvey();
	const { handleStepChange } = useMultiStep();
	const navigate = useNavigate();

	const {
		isOpen: isConfirmDialogOpen,
		handleOpen: handleConfirmDialogOpen,
		handleClose: handleConfirmDialogClose,
	} = useModal(false);

	const handleConfirmDialogCancel = () => {
		handleConfirmDialogClose();
	};

	const handleConfirmDialogConfirm = () => {
		handleConfirmDialogClose();
		handleStepChange(0);
	};

	const handlePrevious = () => {
		handleStepChange(0);
	};

	const sortedQuestions = [...state.survey.question].sort(
		(a, b) => a.questionOrder - b.questionOrder,
	);

	const handleQuestionClick = (questionType: string, questionId: number) => {
		const route =
			QUESTION_TYPE_ROUTES[questionType as keyof typeof QUESTION_TYPE_ROUTES];
		if (route) {
			console.log(`${route}?questionId=${questionId}`);
			navigate(`${route}?questionId=${questionId}`);
		}
	};

	const handleMoveUp = (e: React.MouseEvent, currentIndex: number) => {
		e.stopPropagation();
		if (currentIndex === 0) return;

		const newQuestions = [...sortedQuestions];
		const temp = newQuestions[currentIndex];
		newQuestions[currentIndex] = newQuestions[currentIndex - 1];
		newQuestions[currentIndex - 1] = temp;

		const updatedQuestions = newQuestions.map((question, index) => ({
			...question,
			questionOrder: index,
		}));

		reorderQuestions(updatedQuestions);
	};

	const handleMoveDown = (e: React.MouseEvent, currentIndex: number) => {
		e.stopPropagation();
		if (currentIndex === sortedQuestions.length - 1) return;

		const newQuestions = [...sortedQuestions];
		const temp = newQuestions[currentIndex];
		newQuestions[currentIndex] = newQuestions[currentIndex + 1];
		newQuestions[currentIndex + 1] = temp;

		const updatedQuestions = newQuestions.map((question, index) => ({
			...question,
			questionOrder: index,
		}));

		reorderQuestions(updatedQuestions);
	};

	useEffect(() => {
		const sortedQuestionsList = [...state.survey.question].sort(
			(a, b) => a.questionOrder - b.questionOrder,
		);

		const newOrderMap: Record<number, number> = {};
		sortedQuestionsList.forEach((question, index) => {
			newOrderMap[question.questionId] = index;
		});

		if (!hasInitializedDisplayOrder.current) {
			setDisplayOrderMap(newOrderMap);
			hasInitializedDisplayOrder.current = true;
			return;
		}

		const timer = window.setTimeout(() => {
			setDisplayOrderMap(newOrderMap);
		}, 600);

		return () => {
			window.clearTimeout(timer);
		};
	}, [state.survey.question]);

	useBackEventListener(handleConfirmDialogOpen);

	return (
		<>
			<ConfirmDialog
				open={isConfirmDialogOpen}
				onClose={handleConfirmDialogCancel}
				title="지금 뒤로가면 문항이 사라져요"
				description="현재 항목을 추가로 작성하지 않았어요.
여기서 뒤로간다면, 문항이 사라지게 돼요."
				cancelButton={
					<ConfirmDialog.CancelButton
						size="xlarge"
						onClick={handleConfirmDialogCancel}
					>
						닫기
					</ConfirmDialog.CancelButton>
				}
				confirmButton={
					<ConfirmDialog.ConfirmButton
						color="danger"
						size="xlarge"
						onClick={handleConfirmDialogConfirm}
					>
						뒤로가기
					</ConfirmDialog.ConfirmButton>
				}
			/>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{state.survey.title}
					</Top.TitleParagraph>
				}
				subtitleBottom={
					<Top.SubtitleParagraph>
						{state.survey.description}
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
			<List>
				<AnimatePresence initial={false}>
					{sortedQuestions.map((question, index) => (
						<motion.div
							key={question.questionId}
							layout
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -12 }}
							transition={{ duration: 0.25, ease: "easeInOut" }}
						>
							<ListRow
								onClick={() =>
									handleQuestionClick(question.type, question.questionId)
								}
								contents={
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-1 mb-1">
											<Text
												display="block"
												color={adaptive.grey800}
												typography="t5"
												fontWeight="semibold"
												textAlign="center"
												className="w-10 shrink-0"
											>
												{formatQuestionNumber(
													(displayOrderMap[question.questionId] ??
														question.questionOrder) + 1,
												)}
											</Text>
											<Text
												display="block"
												color={adaptive.grey700}
												typography="t6"
												fontWeight="semibold"
												textAlign="left"
												className="line-clamp-2 flex-1 min-w-0"
											>
												{question.title}
											</Text>
										</div>
										<div className="flex items-center gap-1 pl-11">
											<Text
												color={adaptive.grey600}
												typography="t7"
												fontWeight="medium"
											>
												{question.isRequired ? "필수" : "선택"}
											</Text>
											<Text
												color={adaptive.grey600}
												typography="t7"
												fontWeight="medium"
											>
												·
											</Text>
											<Text
												color={adaptive.grey600}
												typography="t7"
												fontWeight="medium"
											>
												{getQuestionTypeLabel(question.type)}
											</Text>
										</div>
									</div>
								}
								right={
									<div className="flex items-center">
										{isReorderMode && (
											<>
												{index !== 0 && (
													<IconButton
														src="https://static.toss.im/icons/png/4x/icon-chip-arrow-up-mono.png"
														variant="clear"
														color={adaptive.grey600}
														aria-label="위로 이동"
														iconSize={20}
														onClick={(e) => handleMoveUp(e, index)}
													/>
												)}
												{index !== sortedQuestions.length - 1 && (
													<IconButton
														src="https://static.toss.im/icons/png/4x/icon-chip-arrow-down-mono.png"
														variant="clear"
														color={adaptive.grey600}
														aria-label="아래로 이동"
														iconSize={20}
														onClick={(e) => handleMoveDown(e, index)}
													/>
												)}
											</>
										)}
										{!isReorderMode && (
											<IconButton
												src="https://static.toss.im/icons/png/4x/icon-bin-mono.png"
												variant="clear"
												color={adaptive.grey600}
												aria-label="더보기"
												iconSize={16}
												onClick={(e) => {
													e.stopPropagation();
													deleteQuestion(question.questionId.toString());
												}}
											/>
										)}
									</div>
								}
								verticalPadding="large"
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</List>
			<div className="h-25"></div>
			<FormController
				isReorderMode={isReorderMode}
				onReorderModeChange={setIsReorderMode}
			/>
		</>
	);
};
