import { adaptive } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";

export const OXquiz = () => {
	const questions = [
		{
			id: 1,
			question: "반려동물을 키워본 경험이 있으신가요?",
		},
		{
			id: 2,
			question: "취업 준비를 해본 경험이 있으신가요?",
		},
		{
			id: 3,
			question: "영화 시청 경험에 관한 설문에 참여해본 경험이 있으신가요?",
		},
		{
			id: 4,
			question: "온라인 쇼핑을 자주 하시나요?",
		},
		{
			id: 5,
			question: "운동을 정기적으로 하시나요?",
		},
	];

	return (
		<div className="flex flex-col w-full mx-auto px-4 py-6">
			{/* 질문 리스트 */}
			<div className="space-y-6">
				{questions.map((q) => (
					<div
						key={q.id}
						className="bg-gray-50 rounded-2xl p-4 border-none mb-2"
					>
						{/* 질문 */}
						<Text
							display="block"
							color={adaptive.grey800}
							typography="st8"
							fontWeight="semibold"
							className="mb-6"
						>
							{q.question}
						</Text>

						{/* OX 버튼 */}
						<div className="flex gap-4 mt-4">
							<button
								type="button"
								className="flex-1 flex items-center justify-center p-3 transition-all duration-200 bg-blue-100 hover:bg-blue-100"
								style={{ borderRadius: "16px" }}
								aria-label="예"
							>
								<Asset.Icon
									frameShape={Asset.frameShape.CleanW24}
									backgroundColor="transparent"
									name="icon-o-mono"
									color={adaptive.blue500}
									aria-hidden={true}
									ratio="1/1"
								/>
							</button>

							<button
								type="button"
								className="flex-1 flex items-center justify-center p-3 transition-all duration-200 bg-red-100 hover:bg-red-100"
								style={{ borderRadius: "16px" }}
								aria-label="아니오"
							>
								<Asset.Icon
									frameShape={Asset.frameShape.CleanW24}
									backgroundColor="transparent"
									name="icon-x-mono"
									color={adaptive.red500}
									aria-hidden={true}
									ratio="1/1"
								/>
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
