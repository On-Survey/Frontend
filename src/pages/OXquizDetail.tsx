import { adaptive } from "@toss/tds-colors";
import {
	Asset,
	BottomSheet,
	Button,
	FixedBottomCTA,
	Text,
} from "@toss/tds-mobile";
import { useState } from "react";

export const OXquizDetail = () => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	return (
		<>
			<div className="flex flex-col items-center justify-center px-4 py-6 bg-white">
				<div className="mb-6">
					<Button size="small" color="dark" variant="weak">
						Q1
					</Button>
				</div>

				<Text
					display="block"
					color={adaptive.grey900}
					typography="st5"
					fontWeight="semibold"
					textAlign="center"
					className="mb-6"
				>
					반려동물을 키워 본 경험이 있으신가요?
				</Text>

				<div className="flex items-center justify-center gap-2 mt-8 mb-12">
					<Asset.Image
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						src="https://static.toss.im/2d-emojis/png/4x/u1F469_u1F3FB_u200D_u2764_u200D_u1F468_u1F3FB-big.png"
						aria-hidden={true}
						className="aspect-square"
					/>
					<Text
						color={adaptive.grey900}
						typography="t5"
						fontWeight="medium"
						textAlign="center"
					>
						80명이 퀴즈를 풀고 있어요
					</Text>
				</div>

				<div className="flex flex-col gap-2 w-full">
					<div className="flex flex-start items-center gap-2">
						<button
							type="button"
							aria-label="예"
							onClick={() => setSelectedOption("yes")}
							className={`flex items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
								selectedOption === "yes"
									? "bg-blue-200"
									: "bg-blue-100 hover:bg-blue-200"
							}`}
						>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-o-mono"
								color={adaptive.blue500}
								aria-hidden={true}
								ratio="1/1"
							/>
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="medium"
								textAlign="center"
							>
								있어요
							</Text>
						</button>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							aria-label="아니오"
							onClick={() => setSelectedOption("no")}
							className={`flex items-center p-4 transition-colors gap-3 cursor-pointer w-full rounded-2xl! ${
								selectedOption === "no"
									? "bg-red-200"
									: "bg-red-100 hover:bg-red-200"
							}`}
						>
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW24}
								backgroundColor="transparent"
								name="icon-x-mono"
								color={adaptive.red500}
								aria-hidden={true}
								ratio="1/1"
							/>
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="medium"
								textAlign="center"
							>
								없어요
							</Text>
						</button>
					</div>
				</div>
			</div>

			<FixedBottomCTA
				loading={false}
				onClick={() => {
					if (selectedOption) {
						setIsBottomSheetOpen(true);
					}
				}}
			>
				확인
			</FixedBottomCTA>

			<BottomSheet
				header={
					<BottomSheet.Header>
						반려동물 외모 관련 설문은 어떠신가요?
					</BottomSheet.Header>
				}
				headerDescription={
					<BottomSheet.HeaderDescription>
						반려동물을 키워 본 경험이 있는 50명의 응답자가 해당 설문에
						참여했어요!
					</BottomSheet.HeaderDescription>
				}
				open={isBottomSheetOpen}
				onClose={() => setIsBottomSheetOpen(false)}
				cta={
					<BottomSheet.DoubleCTA
						leftButton={
							<Button
								color="dark"
								variant="weak"
								onClick={() => setIsBottomSheetOpen(false)}
							>
								닫기
							</Button>
						}
						rightButton={<Button>다음</Button>}
					/>
				}
			>
				<div className="flex justify-center items-center">
					<Asset.Icon
						frameShape={{ width: 100 }}
						name="icon-double-line-circle"
						aria-hidden={true}
					/>
				</div>
			</BottomSheet>
		</>
	);
};
