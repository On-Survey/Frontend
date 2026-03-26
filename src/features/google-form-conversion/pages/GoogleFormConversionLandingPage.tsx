import { pushGtmEvent } from "@shared/lib/gtm";
import { Asset, BottomSheet, FixedBottomCTA } from "@toss/tds-mobile";
import { useState } from "react";
import landing1 from "../../../assets/landingPage/landing1.svg";
import landing2 from "../../../assets/landingPage/landing2.svg";
import landing3 from "../../../assets/landingPage/landing3.svg";
import landing4 from "../../../assets/landingPage/landing4.svg";
import landing5 from "../../../assets/landingPage/landing5.svg";

export const GoogleFormConversionLandingPage = () => {
	const [isMaintenanceBottomSheetOpen, setIsMaintenanceBottomSheetOpen] =
		useState(false);

	const handleRegister = () => {
		pushGtmEvent({
			event: "form_convert_button_click",
			pagePath: "/google-form-conversion-landing",
		});
		setIsMaintenanceBottomSheetOpen(true);
	};

	const handleCloseMaintenanceBottomSheet = () => {
		setIsMaintenanceBottomSheetOpen(false);
	};

	return (
		<>
			<div className="flex flex-col min-h-screen">
				<img src={landing1} alt="랜딩 페이지 1" className="w-full h-auto" />
				<img src={landing2} alt="랜딩 페이지 2" className="w-full h-auto" />
				<img src={landing3} alt="랜딩 페이지 3" className="w-full h-auto" />
				<img src={landing4} alt="랜딩 페이지 4" className="w-full h-auto" />
				<img src={landing5} alt="랜딩 페이지 5" className="w-full h-auto" />
			</div>

			<FixedBottomCTA loading={false} onClick={handleRegister}>
				설문 등록하기
			</FixedBottomCTA>

			<BottomSheet
				header={
					<BottomSheet.Header>
						지금은 설문 등록이 잠깐 멈춰있어요
					</BottomSheet.Header>
				}
				headerDescription={
					<BottomSheet.HeaderDescription>
						더 안정적인 서비스를 위해 내부 점검 중이에요
						<br />
						3월 30일까지 완료될 예정이니 조금만 기다려 주세요
					</BottomSheet.HeaderDescription>
				}
				open={isMaintenanceBottomSheetOpen}
				onClose={handleCloseMaintenanceBottomSheet}
				cta={
					<BottomSheet.CTA
						color="primary"
						variant="fill"
						onClick={handleCloseMaintenanceBottomSheet}
					>
						확인
					</BottomSheet.CTA>
				}
			>
				<div className="flex justify-center items-center pt-2 pb-2">
					<Asset.Image
						frameShape={{ width: 100 }}
						src="https://static.toss.im/2d-emojis/png/4x/u1F647_u1F3FB.png"
						aria-hidden={true}
					/>
				</div>
			</BottomSheet>
		</>
	);
};
