import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
	const tDemo = await getTranslations("demo")
	const tCommon = await getTranslations("common")

	return {
		title: `${tDemo("packLoopTitle")} · ${tCommon("appName")}`,
		description: tDemo("headerBlurb"),
	}
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
	return children
}
