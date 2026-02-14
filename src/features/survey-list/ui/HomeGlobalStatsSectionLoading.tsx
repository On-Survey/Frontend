export const HomeGlobalStatsSectionLoading = () => {
	return (
		<div className="p-4">
			<div className="w-full h-fit rounded-[24px] p-4 flex items-center gap-2 bg-gray-100">
				<div className="size-6 rounded-full bg-gray-200 animate-pulse shrink-0" />
				<div className="h-5 w-12 rounded bg-gray-200 animate-pulse" />
				<div className="h-5 w-14 rounded bg-gray-200 animate-pulse" />
				<div className="h-5 w-32 rounded bg-gray-200 animate-pulse flex-1" />
			</div>
		</div>
	);
};
