import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomInfo,
	FixedBottomCTA,
	Paragraph,
	Post,
	Spacing,
	Top,
} from "@toss/tds-mobile";
import { useLocation, useNavigate } from "react-router-dom";

type QuestionPackage = "light" | "standard" | "plus";
type RespondentCount = 50 | 100;

const QUESTION_PACKAGE_DISPLAY: Record<QuestionPackage, string> = {
	light: "라이트 (15문항 이내)",
	standard: "스탠다드 (25문항 이내)",
	plus: "플러스 (30문항 이내)",
};

const formatPrice = (price: number) =>
	price.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

export const GoogleFormConversionPaymentConfirmPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const locationState = location.state as
		| {
				questionPackage: QuestionPackage;
				respondentCount: RespondentCount;
				price: number;
		  }
		| undefined;

	const questionPackage = locationState?.questionPackage ?? "light";
	const respondentCount = locationState?.respondentCount ?? 50;
	const price = locationState?.price ?? 9900;

	const handleClose = () => {
		navigate(-1);
	};

	const handlePayment = () => {
		// TODO: 실제 결제 API 연동
		// 결제 완료 후 성공 페이지로 이동
		navigate("/payment/google-form-conversion-success", {
			state: {
				questionPackage,
				respondentCount,
				price,
			},
		});
	};

	return (
		<>
			<div className="px-4 pt-4">
				<button
					type="button"
					onClick={handleClose}
					style={{ background: "none", border: "none", padding: 0 }}
					aria-label="닫기"
				>
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW20}
						backgroundColor="transparent"
						name="icon-x-mono"
						color={adaptive.greyOpacity600}
						aria-hidden={true}
						ratio="1/1"
					/>
				</button>
			</div>
			<Spacing size={12} />
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						{formatPrice(price)}원으로{" "}
						{QUESTION_PACKAGE_DISPLAY[questionPackage]}를 구매할까요?
					</Top.TitleParagraph>
				}
				upper={
					<Top.UpperAssetContent
						content={
							<Asset.Lottie
								frameShape={Asset.frameShape.CleanW60}
								src="https://static.toss.im/lotties-common/check-spot.json"
								loop={false}
								aria-hidden={true}
							/>
						}
					/>
				}
			/>
			<div className="px-4 pb-28">
				<BottomInfo>
					<Post.Paragraph paddingBottom={8} typography="t7">
						<Paragraph.Text>
							<b>안내사항</b>
						</Paragraph.Text>
					</Post.Paragraph>
					<Post.Paragraph paddingBottom={8} typography="t7">
						<Paragraph.Text>
							토스는 해당 서비스 제휴사이며, 결제는 애플 앱스토어를 통해서
							진행돼요.
						</Paragraph.Text>
					</Post.Paragraph>
					<Post.Paragraph paddingBottom={8} typography="t7">
						<Paragraph.Text>
							환불 신청은 애플 앱스토어에서만 가능해요. 토스를 통한 환불 신청은
							불가해요.
						</Paragraph.Text>
					</Post.Paragraph>
					<Post.Paragraph paddingBottom={24} typography="t7">
						<Paragraph.Text></Paragraph.Text>
					</Post.Paragraph>
				</BottomInfo>
			</div>
			<FixedBottomCTA.Single loading={false} onClick={handlePayment}>
				결제하기
			</FixedBottomCTA.Single>
		</>
	);
};
