import { BottomNavigation } from "@shared/components/BottomNavigation";
import { SurveyTabNavigation } from "@shared/components/SurveyTabNavigation";
import { adaptive } from "@toss/tds-colors";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconClip from "../../../assets/mysurveyFloating/icon-clip.svg";
import iconDocs from "../../../assets/mysurveyFloating/icon-document-lines-mono-docs.svg";
import iconClose from "../../../assets/mysurveyFloating/icon-navigation-x-mono.svg";
import plusBtn from "../../../assets/mysurveyFloating/icon-plus-btn.svg";
import { SurveyTabContent } from "../components";
import { SurveyTabLoading } from "../ui/SurveyTabLoading";

const FAB_SIZE_CLASS = "h-[54px] w-[54px] min-h-[54px] min-w-[54px]";

const fabActionVariants = {
	hidden: { opacity: 0, y: 16, scale: 0.92 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			delay: i * 0.07,
			duration: 0.22,
			ease: [0.22, 1, 0.36, 1] as const,
		},
	}),
	exit: (i: number) => ({
		opacity: 0,
		y: 12,
		scale: 0.92,
		transition: {
			delay: (1 - i) * 0.05,
			duration: 0.18,
			ease: [0.4, 0, 1, 1] as const,
		},
	}),
};

export const MySurvey = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);
	const [isFabOpen, setIsFabOpen] = useState(false);

	const goToGoogleFormConversion = () => {
		setIsFabOpen(false);
		navigate("/google-form-conversion-landing", {
			state: { source: "mysurvey_fab" },
		});
	};

	const goToCreateSurvey = () => {
		setIsFabOpen(false);
		navigate("/createFormStart", { state: { source: "mysurvey_button" } });
	};

	return (
		<div className="flex flex-col w-full h-screen bg-white">
			<SurveyTabNavigation
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
			/>
			<div className="h-4" />
			<Suspense fallback={<SurveyTabLoading />}>
				<SurveyTabContent selectedTab={selectedTab} />
			</Suspense>

			<AnimatePresence>
				{isFabOpen && (
					<motion.button
						type="button"
						key="fab-backdrop"
						className="fixed inset-0 z-40 bg-black/65"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						aria-hidden
						onClick={() => setIsFabOpen(false)}
					/>
				)}
			</AnimatePresence>

			<div className="fixed bottom-25 right-4 z-50 flex flex-col items-end gap-3">
				<AnimatePresence>
					{isFabOpen && (
						<>
							<motion.button
								type="button"
								key="fab-google-form"
								custom={0}
								variants={fabActionVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className={`${FAB_SIZE_CLASS} flex shrink-0 items-center justify-center rounded-full! bg-white`}
								onClick={goToGoogleFormConversion}
								aria-label="구글폼으로 설문 등록하기"
							>
								<img
									src={iconClip}
									alt=""
									className="h-[26px] w-6 object-contain"
								/>
							</motion.button>
							<motion.button
								type="button"
								key="fab-new-survey"
								custom={1}
								variants={fabActionVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className={`${FAB_SIZE_CLASS} flex shrink-0 items-center justify-center rounded-full! bg-white`}
								onClick={goToCreateSurvey}
								aria-label="새 설문 만들기"
							>
								<img src={iconDocs} alt="" className="h-6 w-6 object-contain" />
							</motion.button>
						</>
					)}
				</AnimatePresence>

				<button
					type="button"
					onClick={() => setIsFabOpen((o) => !o)}
					className="p-0 border-0 bg-transparent cursor-pointer shrink-0"
					aria-expanded={isFabOpen}
					aria-label={isFabOpen ? "메뉴 닫기" : "설문 추가 메뉴 열기"}
				>
					{isFabOpen ? (
						<span
							className={`${FAB_SIZE_CLASS} inline-flex items-center justify-center rounded-full!`}
							style={{ backgroundColor: adaptive.grey900 }}
						>
							<img
								src={iconClose}
								alt=""
								className="h-[26px] w-6 object-contain"
							/>
						</span>
					) : (
						<img src={plusBtn} alt="" />
					)}
				</button>
			</div>

			<BottomNavigation currentPage="mysurvey" />
		</div>
	);
};
