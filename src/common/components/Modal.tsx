import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cx } from "~/common/utils";


export interface IModalProps {
	title: string;
	children: ReactNode;
	onSubmit: () => void;
	close: () => void;
	submitButtonText?: string;
	disabled?: boolean;
	btnClass?: string;
}

export const Modal = ({title, onSubmit, close, children, submitButtonText, disabled, btnClass}: IModalProps) => {
	const {t} = useTranslation("admin");

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<>
			<div className="modal__overlay" onClick={close} />
			<div className="modal">
				<h3 className="modal__title">{title}</h3>
				<div className="modal__content">
					{children}
				</div>
				<div className="modal__buttons">
					<button onClick={close}>{t("cancel")}</button>
					<button
						className={cx("button--primary", btnClass)}
						onClick={onSubmit}
						disabled={disabled}
					>
						{submitButtonText ?? t("submit")}
					</button>
				</div>
			</div>
		</>
	);
};

