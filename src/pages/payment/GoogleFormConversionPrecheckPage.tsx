import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, Stepper, StepperRow, Top } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionPrecheckPage = () => {
	const navigate = useNavigate();

	const handleNext = () => {
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
		</>
	);
};
