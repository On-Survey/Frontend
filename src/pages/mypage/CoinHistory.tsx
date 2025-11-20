import { adaptive } from "@toss/tds-colors";
import { List, ListRow, Top } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaymentHistory } from "../../service/payments";
import type { PaymentHistoryItem } from "../../service/payments/types";
import { formatDateDisplay } from "../../utils/FormatDate";

export const CoinHistory = () => {
	const navigate = useNavigate();
	const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPaymentHistory = async () => {
			try {
				const history = await getPaymentHistory();
				setPaymentHistory(Array.isArray(history) ? history : []);
			} catch (err) {
				console.error("결제 내역 조회 실패:", err);
				setPaymentHistory([]);
			} finally {
				setIsLoading(false);
			}
		};
		void fetchPaymentHistory();
	}, []);

	const handleClick = (paymentId: number) => {
		navigate(`/mypage/coinHistory/${paymentId}`);
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto px-4 py-6">
				{isLoading ? null : paymentHistory.length === 0 ? (
					<div className="text-center py-6">
						<span style={{ color: adaptive.grey600 }}>
							결제 내역이 없습니다.
						</span>
					</div>
				) : (
					<List>
						{paymentHistory.map((item) => {
							const formattedDate = formatDateDisplay(item.paymentDate);
							const amountText = `${item.totalAmount.toLocaleString()} 코인`;

							return (
								<ListRow
									key={item.paymentId}
									onClick={() => handleClick(item.paymentId)}
									contents={
										<ListRow.Texts
											type="2RowTypeA"
											top={formattedDate}
											topProps={{ color: adaptive.grey800, fontWeight: "bold" }}
											bottom={item.orderId}
											bottomProps={{ color: adaptive.grey600 }}
										/>
									}
									right={
										<ListRow.Texts
											type="Right1RowTypeE"
											top={amountText}
											topProps={{ color: adaptive.grey700 }}
											marginTop={0}
										/>
									}
									verticalPadding="large"
								/>
							);
						})}
					</List>
				)}
			</div>
		</div>
	);
};

export default CoinHistory;
