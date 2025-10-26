import { colors } from "@toss/tds-colors";
import { Asset, Button, ListRow, Text } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();

	const handleOXQuiz = () => {
		navigate("/oxquiz");
	};
	return (
		<div className="flex flex-col w-full mx-auto p-4">
			{/* OX 퀴즈 카드 */}
			<div className="relative mb-8 flex justify-center">
				<button
					type="button"
					className="cursor-pointer hover:opacity-80 transition-opacity"
					onClick={handleOXQuiz}
					aria-label="OX 퀴즈 참여하기"
				>
					<ListRow
						contents={
							<ListRow.Texts
								type="2RowTypeD"
								top="간단한 OX 퀴즈 풀고"
								topProps={{ color: colors.grey600 }}
								bottom="더 많은 설문을 찾아보세요"
								bottomProps={{ color: colors.blue500, fontWeight: "bold" }}
							/>
						}
						verticalPadding="medium"
						className="w-[343px] h-[84px] p-[10px] rounded-3xl border border-blue-500 shadow-md opacity-100"
						left={
							<Asset.Icon
								frameShape={{ width: 24, height: 24 }}
								name="icon-o-x-quiz"
								color={colors.blue500}
								aria-hidden={true}
							/>
						}
						right={
							<Asset.Icon
								frameShape={{ width: 24, height: 24 }}
								name="icn-arrow-rightwards"
								color={colors.grey600}
								aria-hidden={true}
							/>
						}
					/>
				</button>
			</div>

			{/* 사용자를 위한 설문 섹션 */}
			<div className="mb-8">
				<div className="flex items-center justify-between m-4">
					<Text color={colors.grey700} typography="t6" fontWeight="semibold">
						시원님을 위한 설문
					</Text>
					<Text color={colors.grey500} typography="t6" fontWeight="semibold">
						더보기
					</Text>
				</div>

				{/* 설문 카드 1 */}
				<div className="bg-gray-50 rounded-xl p-4 mb-4">
					<div className="flex items-center justify-between mb-3">
						<Button size="small" variant="weak">
							# 건강
						</Button>
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icn-arrow-rightwards"
							color={colors.grey600}
							aria-hidden={true}
						/>
					</div>
					<Text
						color={colors.grey900}
						typography="st8"
						fontWeight="semibold"
						className="mb-2"
					>
						영화 시청 경험에 관한 설문
					</Text>
					<div className="flex items-center gap-1">
						<Asset.Icon
							frameShape={{ width: 20, height: 20 }}
							name="icon-coin-mono"
							color={colors.grey600}
							aria-hidden={true}
						/>
						<Text color={colors.grey700} typography="t6" fontWeight="medium">
							3분이면 100원 획득
						</Text>
					</div>
				</div>

				{/* 설문 카드 2 */}
				<div className="bg-gray-50 rounded-xl p-4">
					<div className="flex items-center justify-between mb-3">
						<Button size="small" variant="weak">
							# 건강
						</Button>
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icn-arrow-rightwards"
							color={colors.grey600}
							aria-hidden={true}
						/>
					</div>
					<Text
						color={colors.grey900}
						typography="st8"
						fontWeight="semibold"
						className="mb-2"
					>
						영화 시청 경험에 관한 설문
					</Text>
					<div className="flex items-center gap-1">
						<Asset.Icon
							frameShape={{ width: 20, height: 20 }}
							name="icon-coin-mono"
							color={colors.grey600}
							aria-hidden={true}
						/>
						<Text color={colors.grey700} typography="t6" fontWeight="medium">
							3분이면 100원 획득
						</Text>
					</div>
				</div>
			</div>

			{/* 마감 임박한 설문 섹션 */}
			<div className="mb-8">
				<div className="flex items-center justify-between m-4">
					<Text color={colors.grey700} typography="t6" fontWeight="semibold">
						마감 임박한 설문
					</Text>
					<Text color={colors.grey500} typography="t6" fontWeight="semibold">
						더보기
					</Text>
				</div>

				{/* 설문 카드 */}
				<div className="bg-gray-50 rounded-xl p-4 mb-4">
					<div className="flex items-center justify-between mb-3">
						<Button size="small" variant="weak">
							# 건강
						</Button>
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icn-arrow-rightwards"
							color={colors.grey600}
							aria-hidden={true}
						/>
					</div>
					<Text
						color={colors.grey900}
						typography="st8"
						fontWeight="semibold"
						className="mb-2"
					>
						영화 시청 경험에 관한 설문
					</Text>
					<div className="flex items-center gap-1">
						<Asset.Icon
							frameShape={{ width: 20, height: 20 }}
							name="icon-coin-mono"
							color={colors.grey600}
							aria-hidden={true}
						/>
						<Text color={colors.grey700} typography="t6" fontWeight="medium">
							3분이면 100원 획득
						</Text>
					</div>
				</div>

				{/* 설문 카드 */}
				<div className="bg-gray-50 rounded-xl p-4 mb-4">
					<div className="flex items-center justify-between mb-3">
						<Button size="small" variant="weak">
							# 건강
						</Button>
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icn-arrow-rightwards"
							color={colors.grey600}
							aria-hidden={true}
						/>
					</div>
					<Text
						color={colors.grey900}
						typography="st8"
						fontWeight="semibold"
						className="mb-2"
					>
						영화 시청 경험에 관한 설문
					</Text>
					<div className="flex items-center gap-1">
						<Asset.Icon
							frameShape={{ width: 20, height: 20 }}
							name="icon-coin-mono"
							color={colors.grey600}
							aria-hidden={true}
						/>
						<Text color={colors.grey700} typography="t6" fontWeight="medium">
							3분이면 100원 획득
						</Text>
					</div>
				</div>
			</div>

			{/* 하단 네비게이션 */}
			<div
				className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 mb-3"
				style={{
					borderRadius: "30px",
					boxShadow:
						"0px 20px 20px -16px #191F2911, 0px 40px 200px 0px #191F293f",
				}}
			>
				<div className="flex items-center justify-around">
					<div className="flex flex-col items-center">
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icon-home-mono"
							color={colors.grey800}
							aria-hidden={true}
						/>
						<Text
							color={colors.grey900}
							typography="st13"
							fontWeight="medium"
							className="mt-1"
						>
							홈
						</Text>
					</div>
					<div className="flex flex-col items-center">
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icon-document-contract-mono"
							color={colors.grey400}
							aria-hidden={true}
						/>
						<Text
							color={colors.grey600}
							typography="st13"
							fontWeight="medium"
							className="mt-1"
						>
							내 설문
						</Text>
					</div>
					<div className="flex flex-col items-center">
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icon-line-three-mono"
							color={colors.grey400}
							aria-hidden={true}
						/>
						<Text
							color={colors.grey600}
							typography="st13"
							fontWeight="medium"
							className="mt-1"
						>
							더보기
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
};
