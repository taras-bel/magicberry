import { getCmsStores } from "@/lib/cms";
import StoresPageContent from "./StoresPageContent";

export const metadata = { title: "Где купить | Magic Berry" };

export default async function StoresPage() {
  const cmsStores = await getCmsStores();

  return <StoresPageContent cmsStores={cmsStores} />;
}
