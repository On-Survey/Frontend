export const HomeGlobalStatsSectionLoading = () => {
	return (
		<>
			{/* 스탯 스트립 스켈레톤 */}
			<div className="p-4">
				<div className="w-full h-fit rounded-[24px] p-4 flex items-center gap-2 bg-gray-100">
					<div className="size-6 rounded-full bg-gray-200 animate-pulse shrink-0" />
					<div className="h-5 w-12 rounded bg-gray-200 animate-pulse" />
					<div className="h-5 w-14 rounded bg-gray-200 animate-pulse" />
					<div className="h-5 w-32 rounded bg-gray-200 animate-pulse flex-1" />
				</div>
			</div>
			{/* 배너 스켈레톤 */}
			<div className="relative mx-4 mb-6 rounded-4xl overflow-hidden shrink-0 h-[337px] bg-gray-200 animate-pulse">
				<div className="absolute inset-0 flex flex-col justify-end p-6 gap-3">
					<div className="h-6 w-3/4 max-w-[200px] rounded bg-gray-300/80 animate-pulse" />
					<div className="h-4 w-1/2 max-w-[120px] rounded bg-gray-300/80 animate-pulse" />
					<div className="h-2 w-full max-w-[180px] rounded-full bg-gray-300/80 animate-pulse mt-2" />
				</div>
			</div>
		</>
	);
};
