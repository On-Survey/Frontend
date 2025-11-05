import { adaptive } from "@toss/tds-colors";
import { Asset, ConfirmDialog, Text } from "@toss/tds-mobile";
import { useState } from "react";
import {
	BUTTON_STYLES,
	ICON_PROPS,
	MAIN_CONTROLS,
	TEXT_PROPS,
} from "../../constants/formController";
import { useMultiStep } from "../../contexts/MultiStepContext";
import { useModal } from "../../hooks/UseToggle";
import QuestionController from "./QuestionController";

function FormController() {
	const [isOpen, setIsOpen] = useState(false);
	const { handleStepChange } = useMultiStep();

	const {
		isOpen: isConfirmDialogOpen,
		handleOpen: handleConfirmDialogOpen,
		handleClose: handleConfirmDialogClose,
	} = useModal(false);

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleSave = () => {
		console.log("임시 저장");
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

	const handleDialogConfirm = () => {
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
					<ConfirmDialog.CancelButton
						size="xlarge"
						onClick={handleConfirmDialogClose}
					>
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
											onClick={handleConfirmDialogOpen}
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
}

export default FormController;
