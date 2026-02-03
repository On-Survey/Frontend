import type { SurveyAnswerDetailFilters } from "@features/mysurvey/service/mysurvey/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// URL 쿼리 파라미터와 동기화되는 설문 필터 훅
export const useSurveyFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const getFiltersFromUrl = useCallback(
		(params: URLSearchParams): SurveyAnswerDetailFilters => {
			const filters: SurveyAnswerDetailFilters = {};
			const ages = params.get("ages");
			const genders = params.get("genders");
			const residences = params.get("residences");

			if (ages) {
				filters.ages = ages.split(",");
			}
			if (genders) {
				filters.genders = genders.split(",");
			}
			if (residences) {
				filters.residences = residences.split(",");
			}

			return filters;
		},
		[],
	);

	const [filters, setFilters] = useState<SurveyAnswerDetailFilters>(() =>
		getFiltersFromUrl(searchParams),
	);

	const previousFiltersKeyRef = useRef<string>("");

	useEffect(() => {
		const urlFilters = getFiltersFromUrl(searchParams);
		const urlFiltersKey = JSON.stringify(urlFilters);

		if (urlFiltersKey !== previousFiltersKeyRef.current) {
			previousFiltersKeyRef.current = urlFiltersKey;
			setFilters(urlFilters);
		}
	}, [searchParams, getFiltersFromUrl]);

	const applyFilters = useCallback(
		(filterParams: SurveyAnswerDetailFilters) => {
			setFilters(filterParams);

			const newSearchParams = new URLSearchParams();
			if (filterParams.ages && filterParams.ages.length > 0) {
				newSearchParams.set("ages", filterParams.ages.join(","));
			}
			if (filterParams.genders && filterParams.genders.length > 0) {
				newSearchParams.set("genders", filterParams.genders.join(","));
			}
			if (filterParams.residences && filterParams.residences.length > 0) {
				newSearchParams.set("residences", filterParams.residences.join(","));
			}
			setSearchParams(newSearchParams, { replace: true });
		},
		[setSearchParams],
	);

	return {
		filters,
		applyFilters,
	};
};
