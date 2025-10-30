import { colors } from "@toss/tds-colors";
import { Asset, Border, FixedBottomCTA, Text, Top } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

export const Survey = () => {
	const navigate = useNavigate();

	const handleStart = () => {
		navigate("/");
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 px-4 overflow-y-auto pb-0">
				<div className="w-full">
					<Top
						title={
							<Top.TitleParagraph size={22} color={colors.grey900}>
								한국 취업 준비생들의 취업 경험에 대한 설문조사
							</Top.TitleParagraph>
						}
						subtitleBottom={
							<Top.SubtitleBadges
								badges={[
									{ text: `# 건강`, color: `blue`, variant: `weak` },
									{ text: `# 헬스`, color: `blue`, variant: `weak` },
								]}
							/>
						}
					/>
				</div>

				<div className="w-full rounded-2xl border border-blue-500 p-5 shadow-sm">
					<Text color={colors.grey900} typography="t5" fontWeight="semibold">
						참여 보상 : 100원
					</Text>
					<div className="h-2" />
					<Text color={colors.grey900} typography="t5" fontWeight="semibold">
						소요 시간 : 3분
					</Text>
				</div>

				<div className="flex items-center gap-3 my-6">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-man"
						aria-hidden={true}
						ratio="1/1"
					/>
					<Text color={colors.grey900} typography="t5" fontWeight="semibold">
						300명이 이 설문에 참여했어요!
					</Text>
				</div>

				<div className="ml-[-16px] mr-[-16px]">
					<Border variant="height16" className="w-full" />
				</div>

				<div className="mt-6">
					<Text
						display="block"
						color={colors.grey700}
						typography="t6"
						fontWeight="regular"
					>
						안녕하세요! 저희는 한국 취업 준비생들의 취업 경험에 대한 설문조사를
						진행하는 큐시즘 온서베이 팀 입니다! 귀한 시간 내어 주셔서
						감사합니다:)
					</Text>
				</div>
			</div>

			<div className="fixed left-0 right-0 bottom-[120px] z-10 px-4">
				<div className="rounded-2xl bg-gray-50 p-4 flex items-center gap-3">
					<Asset.Icon
						frameShape={Asset.frameShape.CleanW24}
						backgroundColor="transparent"
						name="icon-loudspeaker"
						aria-hidden={true}
						ratio="1/1"
					/>
					<Text color={colors.grey800} typography="t6" fontWeight="semibold">
						올바른 응답이 더 좋은 결과를 만들어요.
					</Text>
				</div>
			</div>

			<FixedBottomCTA loading={false} onClick={handleStart}>
				설문 참여하기
			</FixedBottomCTA>
		</div>
	);
};
