import { adaptive } from "@toss/tds-colors";
import { List, ListRow } from "@toss/tds-mobile";
import { useNavigate } from "react-router-dom";

interface CoinHistoryItem {
	id: number;
	date: string; // e.g. "2024년 10월 21일"
	approvalNumber: string; // e.g. "303503544"
	amountText: string; // e.g. "30,000 코인"
}

// Mock 데이터 - 추후 API 연동
const MOCK_COIN_HISTORY: CoinHistoryItem[] = [
	{
		id: 1,
		date: "2024년 10월 21일",
		approvalNumber: "303503544",
		amountText: "30,000 코인",
	},
	{
		id: 2,
		date: "2024년 11월 02일",
		approvalNumber: "998877665",
		amountText: "23,400 코인",
	},
];

export const CoinHistory = () => {
	const navigate = useNavigate();

	const handleClick = (id: number) => {
		navigate(`/mypage/coinHistory/${id}`);
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto px-4 py-6">
				<List>
					{MOCK_COIN_HISTORY.map((item) => (
						<ListRow
							key={item.id}
							onClick={() => handleClick(item.id)}
							contents={
								<ListRow.Texts
									type="2RowTypeA"
									top={item.date}
									topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
									bottom={item.approvalNumber}
									bottomProps={{ color: adaptive.grey600 }}
								/>
							}
							right={
								<ListRow.Texts
									type="Right1RowTypeE"
									top={item.amountText}
									topProps={{ color: adaptive.grey700 }}
									marginTop={0}
								/>
							}
							verticalPadding="large"
						/>
					))}
				</List>
			</div>
		</div>
	);
};

export default CoinHistory;
