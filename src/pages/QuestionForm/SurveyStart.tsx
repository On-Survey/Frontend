import { adaptive } from "@toss/tds-colors";
import { Asset, FixedBottomCTA, List, ListRow, Top } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

export const SurveyStart = () => {
	const navigate = useNavigate();

	const handleRegister = () => {
		navigate("/createForm");
	};

	return (
		<div className="flex flex-col w-full min-h-screen">
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						설문 응답 모으기, 이제 걱정 마세요
					</Top.TitleParagraph>
				}
				upper={
					<Top.UpperAssetContent
						content={
							<Asset.Icon
								frameShape={Asset.frameShape.CleanW60}
								name="icon-credit-grade-check-purple-fill"
								aria-hidden={true}
							/>
						}
					/>
				}
			/>

			<List>
				<ListRow
					left={
						<ListRow.AssetImage
							src="https://static.toss.im/2d-emojis/png/4x/u1F3C3_u200D_u2640_uFE0F.png"
							shape="squircle"
						/>
					}
					contents={
						<ListRow.Texts
							type="2RowTypeA"
							top="기존 대비 최대 10배 빠른 응답 확보"
							topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
							bottom="빠르게 검증하고 빠르게 실행해요"
							bottomProps={{ color: adaptive.grey600 }}
						/>
					}
					verticalPadding="large"
				/>
				<ListRow
					left={
						<ListRow.AssetImage
							src="https://static.toss.im/2d-emojis/png/4x/u1F3AF.png"
							shape="squircle"
						/>
					}
					contents={
						<ListRow.Texts
							type="2RowTypeA"
							top="원하는 타겟에게만 정확하게 도달"
							topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
							bottom="성별, 연령, 지역, 관심사까지 맞춤형 타겟팅."
							bottomProps={{ color: adaptive.grey600 }}
						/>
					}
					verticalPadding="large"
				/>
				<ListRow
					left={<ListRow.AssetIcon name="icon-money-bag-skyblue" />}
					contents={
						<ListRow.Texts
							type="2RowTypeA"
							top="효율적인 비용으로 고품질 응답"
							topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
							bottom="낮은 비용으로 더 많은 인사이트를 얻으세요."
							bottomProps={{ color: adaptive.grey600 }}
						/>
					}
					verticalPadding="large"
				/>
			</List>

			<FixedBottomCTA loading={false} onClick={handleRegister}>
				설문 등록하기
			</FixedBottomCTA>
		</div>
	);
};
