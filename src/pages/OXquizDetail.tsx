import { adaptive } from "@toss/tds-colors";
import { Asset, Button, FixedBottomCTA, Text } from "@toss/tds-mobile";

export const OXquizDetail = () => {
	return (
		<>
			<div className="flex flex-col items-center justify-center px-4 py-6 bg-white">
				{/* 질문 번호 */}
				<div className="mb-6">
					<Button size="small" color="dark" variant="weak">
						Q1
					</Button>
				</div>

				{/* 질문 */}
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

				{/* 참여자 수와 이모지 */}
				<div className="flex items-center justify-center gap-2 mt-8 mb-12">
					<Asset.Image
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						src="https://static.toss.im/2d-emojis/png/4x/u1F469_u1F3FB_u200D_u2764_u200D_u1F468_u1F3FB-big.png"
						aria-hidden={true}
						style={{ aspectRatio: "1/1" }}
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

				{/* 답변 옵션들 */}
				<div className="flex flex-col gap-2 w-full">
					{/* 있어요 옵션 */}
					<div className="flex flex-start items-center gap-2">
						<button
							type="button"
							aria-label="예"
							className="flex items-center p-4 bg-blue-100 hover:bg-blue-200 transition-colors gap-3 cursor-pointer w-full"
							style={{ borderRadius: "16px" }}
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

					{/* 없어요 옵션 */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							aria-label="아니오"
							className="flex items-center p-4 bg-red-100 hover:bg-red-200 transition-colors gap-3 cursor-pointer w-full"
							style={{ borderRadius: "16px" }}
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

			{/* 하단 확인 버튼 */}
			<FixedBottomCTA loading={false}>확인</FixedBottomCTA>
		</>
	);
};
