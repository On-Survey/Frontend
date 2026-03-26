import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	CTAButton,
	FixedBottomCTA,
	Spacing,
	Text,
} from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionInquirySuccessPage = () => {
	const navigate = useNavigate();

	const handleContinue = () => {
		navigate("/payment/google-form-conversion");
	};

	const handleGoHome = () => {
		navigate("/home");
	};

	return (
		<>
			<Spacing size={160} />
			<Asset.Image
				frameShape={Asset.frameShape.CleanW100}
				backgroundColor="transparent"
				src="https://static.toss.im/lotties/check-spot-apng.png"
				aria-hidden={true}
				style={{ aspectRatio: "1/1" }}
			/>
			<Spacing size={24} />
			<Text
				display="block"
				color={adaptive.grey800}
				typography="t2"
				fontWeight="bold"
				textAlign="center"
			>
				문의 사항이 잘 접수되었어요
			</Text>
			<Text
				display="block"
				color={adaptive.grey700}
				typography="t5"
				fontWeight="medium"
				textAlign="center"
			>
				등록해주신 문의 사항은 24시간 이내로 빠르게 검토해 이메일로 안내해
				드릴게요.
			</Text>
			<FixedBottomCTA.Double
				leftButton={
					<CTAButton
						color="dark"
						variant="weak"
						display="block"
						onClick={handleContinue}
					>
						계속 진행하기
					</CTAButton>
				}
				rightButton={
					<CTAButton display="block" onClick={handleGoHome}>
						홈 화면으로 돌아가기
					</CTAButton>
				}
			/>
		</>
	);
};
