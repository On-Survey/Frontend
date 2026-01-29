import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionPaymentSuccessPage = () => {
	const navigate = useNavigate();

	const handleConfirm = () => {
		// TODO: 홈으로 이동하거나 적절한 페이지로 이동
		navigate("/home");
	};

	return (
		<>
			<div className="flex flex-col items-center justify-center min-h-screen px-4 pb-28">
				<Text
					display="block"
					color={adaptive.grey800}
					typography="t2"
					fontWeight="bold"
					textAlign="center"
				>
					결제가 완료됐어요
				</Text>
				<Text
					display="block"
					color={adaptive.grey700}
					typography="t5"
					fontWeight="medium"
					textAlign="center"
					className="mt-4"
				>
					등록해주신 폼은 빠르게 검토해 이메일로 안내해 드릴게요.
				</Text>
			</div>
			<FixedBottomCTA loading={false} onClick={handleConfirm}>
				확인했어요
			</FixedBottomCTA>
		</>
	);
};
