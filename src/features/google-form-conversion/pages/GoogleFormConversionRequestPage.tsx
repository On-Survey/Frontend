import type { FormValues } from "@features/google-form-conversion/types";
import {
	isGoogleFormConversionContactEmail,
	isGoogleFormLinkUrl,
} from "@features/google-form-conversion/utils";
import { adaptive } from "@toss/tds-colors";
import { FixedBottomCTA, TextField, Top } from "@toss/tds-mobile";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const GoogleFormConversionRequestPage = () => {
	const navigate = useNavigate();

	const {
		control,
		watch,
		handleSubmit: rhfHandleSubmit,
		formState: { errors },
	} = useForm<Pick<FormValues, "formLink" | "email">>({
		mode: "onChange",
		defaultValues: {
			formLink: "",
			email: "",
		},
	});

	const formLink = watch("formLink");

	const onSubmit = useCallback(
		(data: Pick<FormValues, "formLink" | "email">) => {
			navigate("/payment/google-form-conversion-loading", {
				state: {
					formLink: data.formLink.trim(),
					email: data.email,
				},
			});
		},
		[navigate],
	);

	return (
		<>
			<Top
				title={
					<Top.TitleParagraph size={22} color={adaptive.grey900}>
						설문 정보를 입력해주세요
					</Top.TitleParagraph>
				}
				lowerGap={0}
			/>

			<div className="flex flex-col gap-4 px-2 pt-4">
				<Controller
					control={control}
					name="formLink"
					rules={{
						required: "폼 링크를 입력해주세요",
						validate: (v) =>
							isGoogleFormLinkUrl(v?.trim() ?? "") ||
							"링크를 다시 한번 확인해 주세요!",
					}}
					render={({ field: { onChange, value, onBlur } }) => (
						<TextField.Clearable
							variant="line"
							hasError={!!errors.formLink}
							label="폼 링크"
							labelOption="sustain"
							help={
								errors.formLink?.message ??
								'공유 > 편집자 보기 "링크가 있는 모든 사용자로 변경" 해주세요'
							}
							value={value}
							placeholder="https://docs.google.com/..."
							suffix=""
							prefix=""
							onChange={(e) => onChange(e.target.value)}
							onBlur={onBlur}
						/>
					)}
				/>

				<Controller
					control={control}
					name="email"
					rules={{
						validate: (v) => {
							if (isGoogleFormConversionContactEmail(v ?? "")) return true;
							const trimmed = (v ?? "").trim();
							return trimmed.length > 0
								? "올바른 이메일 형식을 입력해주세요"
								: "이메일을 입력해주세요";
						},
					}}
					render={({ field: { onChange, value, onBlur } }) => (
						<TextField.Clearable
							variant="line"
							hasError={!!errors.email}
							label="이메일"
							labelOption="sustain"
							help={errors.email?.message ?? "안내 받을 이메일을 입력해 주세요"}
							value={value}
							placeholder="example@toss.im"
							suffix=""
							prefix=""
							onChange={(e) => onChange(e.target.value)}
							onBlur={onBlur}
						/>
					)}
				/>
			</div>

			<FixedBottomCTA
				loading={false}
				onClick={rhfHandleSubmit(onSubmit)}
				disabled={
					!!errors.formLink ||
					!!errors.email ||
					!formLink.trim() ||
					!isGoogleFormLinkUrl(formLink.trim()) ||
					!isGoogleFormConversionContactEmail(watch("email") ?? "")
				}
			>
				다음
			</FixedBottomCTA>
		</>
	);
};
