import { adaptive } from "@toss/tds-colors";
import { Asset, Border, Button, List, ListRow, Text } from "@toss/tds-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "../components/BottomNavigation";
import { useImagePicker } from "../hooks/useImagePicker";
import { getMemberInfo } from "../service/userInfo";
import type { MypageData } from "../types/mypage";

export const Mypage = () => {
	const navigate = useNavigate();
	const [mypageData, setMypageData] = useState<MypageData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {
		selectedImage: profileImage,
		fileInputRef,
		handleImageClick,
		handleFileChange,
		setSelectedImage,
	} = useImagePicker(mypageData?.profileImage);

	useEffect(() => {
		const fetchMemberInfo = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const memberInfo = await getMemberInfo();
				const mypageData: MypageData = {
					profileImage:
						memberInfo.profileUrl ||
						"https://static.toss.im/illusts/img-profile-03.png",
					chargeCash: memberInfo.coin,
					points: memberInfo.promotionPoint,
				};
				setMypageData(mypageData);
				setSelectedImage(mypageData.profileImage);
			} catch (err) {
				console.error("회원 정보 조회 실패:", err);
				setError("회원 정보를 불러오지 못했습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		void fetchMemberInfo();
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

	if (isLoading) {
		return (
			<div className="flex flex-col w-full h-screen">
				<div className="flex-1 flex items-center justify-center">
					<Text color={adaptive.grey600} typography="t7">
						회원 정보를 불러오는 중입니다...
					</Text>
				</div>
			</div>
		);
	}

	if (error || !mypageData) {
		return (
			<div className="flex flex-col w-full h-screen">
				<div className="flex-1 flex items-center justify-center">
					<Text color={adaptive.red500} typography="t7">
						{error || "회원 정보를 불러올 수 없습니다."}
					</Text>
				</div>
			</div>
		);
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
