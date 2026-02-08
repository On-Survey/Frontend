const SkeletonCard = () => (
	<div className="bg-gray-50 rounded-xl p-4 space-y-3">
		<div className="flex items-center gap-2">
			<div className="h-5 w-14 rounded-full bg-gray-200 animate-pulse" />
			<div className="h-4 flex-1 max-w-[60%] rounded bg-gray-200 animate-pulse" />
		</div>
		<div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
		<div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
		<div className="h-2 w-full rounded-full bg-gray-200 animate-pulse" />
	</div>
);

export const SurveyTabLoading = () => {
	return (
		<div className="flex-1 px-4 pb-24 space-y-4">
			<SkeletonCard />
			<SkeletonCard />
			<SkeletonCard />
		</div>
	);
};
