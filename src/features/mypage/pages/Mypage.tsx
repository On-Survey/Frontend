import { BottomNavigation } from "@shared/components/BottomNavigation";
import { Suspense } from "react";
import { MypageContent } from "../components/MypageContent";
import { MypageMenuList } from "../components/MypageMenuList";
import { MypageContentLoading } from "../ui/MypageContentLoading";

export const Mypage = () => {
	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex-1 overflow-y-auto p-2 pb-20">
				<Suspense fallback={<MypageContentLoading />}>
					<MypageContent />
				</Suspense>
				<div className="h-4" />
				<MypageMenuList />
			</div>
			<BottomNavigation currentPage="more" />
		</div>
	);
};
