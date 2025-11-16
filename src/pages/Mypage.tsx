import { adaptive } from "@toss/tds-colors";
import { Asset, Border, Button, List, ListRow, Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../components/BottomNavigation";
import { useImagePicker } from "../hooks/useImagePicker";
import type { MypageData } from "../types/mypage";

export const Mypage = () => {
	const navigate = useNavigate();
	const [mypageData, setMypageData] = useState<MypageData | null>(null);
	const {
		selectedImage: profileImage,
		fileInputRef,
		handleImageClick,
		handleFileChange,
		setSelectedImage,
	} = useImagePicker(mypageData?.profileImage);

	useEffect(() => {
		// mock
		const mockMypageData: MypageData = {
			profileImage: "https://static.toss.im/illusts/img-profile-03.png",
			chargeCash: 0,
			points: 3200,
		};
		setMypageData(mockMypageData);
		setSelectedImage(mockMypageData.profileImage);
	}, [setSelectedImage]);

	const handleHome = () => {
		navigate("/home");
	};

	const handleMySurvey = () => {
		navigate("/mysurvey");
	};

	const handleOrderHistory = () => {
		navigate("/mypage/orderHistory");
	};

	const handleRefundPolicy = () => {
		navigate("/mypage/refundPolicy");
	};

	const handleCoinHistory = () => {
		navigate("/mypage/coinHistory");
	};

	if (!mypageData) {
		return null;
	}

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto p-2 pb-20">
				<div className="px-4">
					<div className="relative flex items-center justify-center">
						<button
							type="button"
							onClick={handleImageClick}
							className="cursor-pointer relative"
							aria-label="프로필 이미지 변경"
						>
							<img
								src={
									profileImage ||
									"https://static.toss.im/illusts/img-profile-03.png"
								}
								alt="프로필"
								className="w-24 h-24 rounded-full object-cover"
							/>
							<div className="absolute bottom-0 right-0">
								<Asset.Icon
									frameShape={{ width: 24, height: 24 }}
									name="icon-plus-circle-grey"
									aria-hidden={true}
								/>
							</div>
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
							aria-label="프로필 이미지 선택"
						/>
					</div>
					<div className="bg-gray-100 rounded-xl p-4 mt-4">
						<div className="flex justify-between items-center">
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="semibold"
							>
								충전 캐쉬
							</Text>
							<div className="flex items-center gap-2">
								<Text
									display="block"
									color={adaptive.grey900}
									typography="t5"
									fontWeight="bold"
									textAlign="right"
								>
									{mypageData.chargeCash.toLocaleString()}원
								</Text>
								<Button size="small">충전하기</Button>
							</div>
						</div>
						<div className="h-[13px]" />
						<Border />
						<div className="flex justify-between items-center mt-4">
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="semibold"
							>
								내 포인트
							</Text>
							<Text
								display="block"
								color={adaptive.grey900}
								typography="t5"
								fontWeight="bold"
								textAlign="right"
							>
								{mypageData.points.toLocaleString()}원
							</Text>
						</div>
					</div>
				</div>
				<div className="h-4" />
				<List>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="주문내역"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleOrderHistory}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="코인 사용 내역"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleCoinHistory}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="환불 정책"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
						onClick={handleRefundPolicy}
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="서비스 이용약관"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="개인 정보 처리 방침"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
					/>
					<ListRow
						contents={
							<ListRow.Texts
								type="1RowTypeA"
								top="사업자 정보"
								topProps={{ color: adaptive.grey700 }}
							/>
						}
						arrowType="right"
					/>
				</List>
			</div>

			<BottomNavigation
				currentPage="more"
				onHomeClick={handleHome}
				onMySurveyClick={handleMySurvey}
			/>
		</div>
	);
};
