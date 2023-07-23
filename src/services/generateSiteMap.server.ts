import format from "xml-formatter";
import { getOppositeLanguage } from "~/common/utils/language";
import type { TLang } from "~/types";


const origin = process.env.ORIGIN;

const hasAlternateUrl = (article: Article, articles: Article[]) => {
	return articles.some(a => a.lang === getOppositeLanguage(article.lang as TLang)
		&& a.section === article.section
		&& a.slug === article.slug,
	);
};

export const generateSiteMap = async () => {
	const articles = await db.article.findMany({
		where: {draft: false},
		orderBy: [{section: "desc"}, {slug: "desc"}, {lang: "desc"}],
	});
	const sections = Array.from(new Set(articles.map(article => article.section)));
	const sectionUrls = sections.map(section => `
    <url>
      <loc>${origin}/uk/${section}</loc>
      <xhtml:link rel='alternate' hreflang='uk' href='${origin}/uk/${section}'/>
      <xhtml:link rel='alternate' hreflang='en' href='${origin}/en/${section}'/>
    </url>
    <url>
      <loc>${origin}/en/${section}</loc>
      <xhtml:link rel='alternate' hreflang='en' href='${origin}/en/${section}'/>
      <xhtml:link rel='alternate' hreflang='uk' href='${origin}/uk/${section}'/>
    </url>`);
	const articlesUrls = articles.map(article => {
		const oppositeLang = getOppositeLanguage(article.lang as TLang);
		const alternate = hasAlternateUrl(article, articles)
			? `<xhtml:link rel='alternate' hreflang='${oppositeLang}' href='${origin}/${oppositeLang}/${article.section}/${article.slug}'/>`
			: "";
		return `
      <url>
        <loc>${origin}/${article.lang}/${article.section}/${article.slug}</loc>
        <xhtml:link rel='alternate' hreflang='${article.lang}' href='${origin}/${article.lang}/${article.section}/${article.slug}'/>
        ${alternate}
      </url>`;
	});

	const sitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns='https://www.sitemaps.org/schemas/sitemap/0.9' xmlns:xhtml='https://www.w3.org/1999/xhtml'>
    <url>
      <loc>${origin}</loc>
      <xhtml:link rel='alternate' hreflang='uk' href='${origin}'/>
      <xhtml:link rel='alternate' hreflang='en' href='${origin}/en'/>
    </url>
    <url>
      <loc>${origin}/en</loc>
      <xhtml:link rel='alternate' hreflang='en' href='${origin}/en'/>
      <xhtml:link rel='alternate' hreflang='uk' href='${origin}'/>
    </url>
    ${sectionUrls.join("")}
    ${articlesUrls.join("")}
  </urlset>
  `;

	await Bun.write(`${process.cwd()}/public/sitemap.xml`, format(sitemap, {
		whiteSpaceAtEndOfSelfclosingTag: true,
		indentation: "  ",
		collapseContent: true,
		lineSeparator: "\n",
	}));
	await Bun.write(`${process.cwd()}/public/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
};


declare global {
	var __sitemapGenerated: boolean;
}
// generates sitemap on application start
if (!global.__sitemapGenerated) {
	(async () => {
		try {
			console.info("Generating sitemap.xml");
			await generateSiteMap();
			global.__sitemapGenerated = true;
		} catch (err) {
			console.error(err);
		}
	})();
}
