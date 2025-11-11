import { adaptive, colors } from "@toss/tds-colors";
import {
	Asset,
	FixedBottomCTA,
	ProgressBar,
	Text,
	Toast,
} from "@toss/tds-mobile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../hooks/UseToggle";

export const SurveyComplete = () => {
	const navigate = useNavigate();
	const { isOpen: toastOpen, handleOpen, handleClose } = useModal(false);

	useEffect(() => {
		handleOpen();
		const timer = setTimeout(() => {
			handleClose();
		}, 3000);

		return () => {
			clearTimeout(timer);
			handleClose();
		};
	}, [handleClose, handleOpen]);

	return (
		<div className="flex min-h-screen w-full flex-col bg-white">
			<ProgressBar size="normal" color={colors.blue500} progress={1} />

			<div className="flex flex-1 flex-col items-center px-4">
				<Toast
					position="top"
					open={toastOpen}
					text="400원 받았어요."
					style={{ top: "350px" }}
					leftAddon={
						<div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
							P
						</div>
					}
					duration={3000}
					onClose={handleClose}
					onExited={handleClose}
				/>
				<div className="h-[168px]" />
				<Text
					display="block"
					color={adaptive.grey800}
					typography="t3"
					fontWeight="bold"
					textAlign="center"
				>
					자연님의 소중한 의견 감사합니다!
				</Text>
				<div className="h-6" />
				<Asset.Icon
					frameShape={Asset.frameShape.CleanW100}
					backgroundColor="transparent"
					name="icon-check-circle-blue"
					ratio="1/1"
					aria-hidden={true}
				/>

				<div className="mt-10" />
			</div>

			<div className="px-4 pb-4">
				<div className="mb-4 flex items-center gap-2 rounded-[18px] bg-gray-100 px-4 py-3">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-loudspeaker"
						ratio="1/1"
						aria-hidden={true}
					/>
					<Text color={adaptive.grey900} typography="t6">
						리워드 지급이 지연될 수 있어요
					</Text>
				</div>
			</div>
			<FixedBottomCTA loading={false} onClick={() => navigate("/mysurvey")}>
				다른 설문 참여하기
			</FixedBottomCTA>
		</div>
	);
};

export default SurveyComplete;
