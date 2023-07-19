import type { TLang } from "~/types";


interface IGetResetPasswordTemplateParams {
	firstName: string;
	token: string;
	userId: string;
}

export const getResetPasswordTemplate = (lang: TLang, params: IGetResetPasswordTemplateParams) => {
	return `
  <html lang='${lang}'>
  <body>
  ${lang === "en" ? `
    <h3>Hi ${params.firstName}!</h3>
    <p>To reset password follow the <a href='${process.env.ORIGIN}/${lang}/auth/reset-password?token=${params.token}&userId=${params.userId}'>link</a>, it will expire in 15 minutes.</p>
    <p>If you didn't request it, just ignore this email, and make sure no one has access to it.</p>
  ` : `
    <h3>Привіт ${params.firstName}!</h3>
    <p>Щоб відновити пароль, перейдіть за <a href='${process.env.ORIGIN}/${lang}/auth/reset-password?token=${params.token}&userId=${params.userId}'>посиланням</a>, воно дійсне 15 хвилин.</p>
    <p>Якщо ви не намагалися відновити пароль -- просто ігноруйте цей лист, і переконайтеся, що ніхто не має доступу до вашого аккаунту.</p>
  `}
  </body>
  </html>
  `;
};
