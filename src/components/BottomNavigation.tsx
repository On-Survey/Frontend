import { colors } from "@toss/tds-colors";
import { Asset, Text } from "@toss/tds-mobile";

interface BottomNavigationProps {
	currentPage: "home" | "mysurvey" | "more";
	onHomeClick?: () => void;
	onMySurveyClick?: () => void;
	onMoreClick?: () => void;
}

export const BottomNavigation = ({
	currentPage,
	onHomeClick,
	onMySurveyClick,
	onMoreClick,
}: BottomNavigationProps) => {
	const getIconColor = (page: string) => {
		return currentPage === page ? colors.grey800 : colors.grey400;
	};

	const getTextColor = (page: string) => {
		return currentPage === page ? colors.grey900 : colors.grey600;
	};

	const handleHomeClick = () => {
		if (onHomeClick) {
			onHomeClick();
		} else {
			window.location.href = "/home";
		}
	};

	const handleMySurveyClick = () => {
		if (onMySurveyClick) {
			onMySurveyClick();
		} else {
			window.location.href = "/mysurvey";
		}
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 mb-3 rounded-[30px] shadow-[0px_20px_20px_-16px_#191F2911,0px_40px_200px_0px_#191F293f]">
			<div className="flex items-center justify-around">
				<button
					type="button"
					onClick={handleHomeClick}
					className="flex flex-col items-center cursor-pointer"
				>
					<Asset.Icon
						frameShape={{ width: 24, height: 24 }}
						name="icon-home-mono"
						color={getIconColor("home")}
						aria-hidden={true}
					/>
					<Text
						color={getTextColor("home")}
						typography="st13"
						fontWeight="medium"
						className="mt-1"
					>
						홈
					</Text>
				</button>
				{currentPage === "mysurvey" ? (
					<div className="flex flex-col items-center">
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icon-document-contract-mono"
							color={getIconColor("mysurvey")}
							aria-hidden={true}
						/>
						<Text
							color={getTextColor("mysurvey")}
							typography="st13"
							fontWeight="medium"
							className="mt-1"
						>
							내 설문
						</Text>
					</div>
				) : (
					<button
						type="button"
						onClick={handleMySurveyClick}
						className="flex flex-col items-center cursor-pointer"
					>
						<Asset.Icon
							frameShape={{ width: 24, height: 24 }}
							name="icon-document-contract-mono"
							color={getIconColor("mysurvey")}
							aria-hidden={true}
						/>
						<Text
							color={getTextColor("mysurvey")}
							typography="st13"
							fontWeight="medium"
							className="mt-1"
						>
							내 설문
						</Text>
					</button>
				)}
				<button
					type="button"
					onClick={onMoreClick}
					className="flex flex-col items-center cursor-pointer"
					aria-label="더보기"
				>
					<Asset.Icon
						frameShape={{ width: 24, height: 24 }}
						name="icon-line-three-mono"
						color={getIconColor("more")}
						aria-hidden={true}
					/>
					<Text
						color={getTextColor("more")}
						typography="st13"
						fontWeight="medium"
						className="mt-1"
					>
						더보기
					</Text>
				</button>
			</div>
		</div>
	);
};
