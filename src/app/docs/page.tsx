import { getCmsDocs } from "@/lib/cms";
import DocsPageContent from "./DocsPageContent";

export const metadata = {
  title: "Документы и сертификаты",
  description: "Сертификаты качества, техническая документация и протоколы испытаний продукции Latvbelfruits.",
};

export default async function DocsPage() {
  const cms = await getCmsDocs();

  return <DocsPageContent cmsDocs={cms} />;
}
