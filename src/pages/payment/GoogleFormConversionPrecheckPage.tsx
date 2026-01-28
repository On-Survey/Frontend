import { adaptive } from "@toss/tds-colors";
import {
	AgreementV4,
	BottomSheet,
	Button,
	FixedBottomCTA,
	Stepper,
	StepperRow,
	Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../hooks/UseToggle";

export const GoogleFormConversionPrecheckPage = () => {
	const navigate = useNavigate();
	const [isAgreed, setIsAgreed] = useState(false);
	const {
		isOpen: isConsentBottomSheetOpen,
		handleOpen: handleConsentBottomSheetOpen,
		handleClose: handleConsentBottomSheetClose,
	} = useModal(false);

	const handleNext = () => {
		handleConsentBottomSheetOpen();
	};

	const handleAgreementClick = () => {
		navigate("/payment/google-form-conversion-privacy-consent");
	};

	const handleConsentConfirm = () => {
		handleConsentBottomSheetClose();
		// TODO: 실제 결제/다음 단계로 이동 경로 확정 시 수정
		navigate(-1);
	};

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						결제 전 꼭 확인해주세요
					</Top.TitleParagraph>
				}
				subtitleTop={<Top.SubtitleParagraph>안내사항</Top.SubtitleParagraph>}
			/>

			<div className="px-4 pt-6 pb-28">
				<Stepper>
					<StepperRow
						left={<StepperRow.NumberIcon number={1} />}
						center={
							<StepperRow.Texts
								type="A"
								title="설문 변환 가능 범위 및 제출 양식 안내"
								description="온서베이는 구글폼 설문만 변환 가능하며, 일부 문항 유형은 시스템 구조상 변환이 제한되거나 수정이 필요할 수 있어 개별 안내 후 협의를 진행해요."
							/>
						}
					/>
					<StepperRow
						left={<StepperRow.NumberIcon number={2} />}
						center={
							<StepperRow.Texts
								type="A"
								title="구글폼 링크 제출 안내"
								description="편집 가능한 구글폼 링크를 제출해 주셔야 하며, 공유 〉 편집자 〉 '링크가 있는 모든 사용자' 설정은 필수예요."
							/>
						}
					/>
					<StepperRow
						left={<StepperRow.NumberIcon number={3} />}
						center={
							<StepperRow.Texts
								type="A"
								title="설문 검수 및 진행 안내"
								description="설문은 내부 운영 기준에 따라 사전 검수를 진행하며, 윤리적·법적 문제나 안내사항 미준수 시 제작 또는 진행이 중단(반려)될 수 있고 관련 내용은 이메일로 안내드려요."
							/>
						}
						hideLine={true}
					/>
				</Stepper>
			</div>

			<FixedBottomCTA loading={false} onClick={handleNext}>
				다음
			</FixedBottomCTA>

			<BottomSheet
				header={
					<BottomSheet.Header>
						원활한 등록 안내를 위해 동의가 필요해요
					</BottomSheet.Header>
				}
				headerDescription={
					<BottomSheet.HeaderDescription>
						이메일로 설문 등록에 대한 안내를 드릴 예정이에요
					</BottomSheet.HeaderDescription>
				}
				open={isConsentBottomSheetOpen}
				onClose={handleConsentBottomSheetClose}
				cta={
					<BottomSheet.DoubleCTA
						leftButton={
							<Button
								color="dark"
								variant="weak"
								onClick={handleConsentBottomSheetClose}
							>
								닫기
							</Button>
						}
						rightButton={
							<Button disabled={!isAgreed} onClick={handleConsentConfirm}>
								다음
							</Button>
						}
					/>
				}
			>
				<div className="px-4 py-6">
					<AgreementV4
						variant="small"
						left={
							<AgreementV4.Checkbox
								variant="dot"
								checked={isAgreed}
								onChange={() => setIsAgreed(!isAgreed)}
							/>
						}
						middle={
							<AgreementV4.Text
								onClick={(e) => {
									e.stopPropagation();
									handleAgreementClick();
								}}
								style={{ cursor: "pointer" }}
							>
								개인정보 수집·이용 동의
							</AgreementV4.Text>
						}
					/>
				</div>
				<>콘텐츠를 클릭해 확인해주세요</>
			</BottomSheet>
		</>
	);
};
