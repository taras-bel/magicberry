import { getCmsStores } from "@/lib/cms";
import StoresPageContent from "./StoresPageContent";

export const metadata = { title: "Где купить | Latvbelfruits" };

export default async function StoresPage() {
  const cmsStores = await getCmsStores();

  return <StoresPageContent cmsStores={cmsStores} />;
}
