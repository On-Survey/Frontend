//예시 ) 커스텀 훅
import { useState } from "react";

export function useToggle(initial = false) {
	const [state, setState] = useState(initial);
	const toggle = () => setState((prev) => !prev);
	return { state, toggle };
}

// 모달/바텀시트 상태 관리를 위한 커스텀 훅
export function useModal(initial = false) {
	const [isOpen, setIsOpen] = useState(initial);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);
	const toggle = () => setIsOpen((prev) => !prev);

	return {
		isOpen,
		handleOpen,
		handleClose,
		toggle,
	};
}
