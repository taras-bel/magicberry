export type CmsProduct = {
  id: string | number;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  image?: { url: string } | string;
  priceFrom?: number;
  unit?: string;
};

interface CmsResponse<T> {
  data: T[];
}

interface CmsProductData {
  id: number;
  attributes: {
    slug?: string;
    name?: string;
    shortDescription?: string;
    description?: string;
    category?: string;
    image?: {
      data?: {
        attributes?: {
          url?: string;
        };
      };
      url?: string;
    };
    priceFrom?: number;
    unit?: string;
  };
}

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;
const CMS_TOKEN = process.env.CMS_API_TOKEN;

async function cmsFetch<T>(path: string): Promise<T> {
  if (!CMS_URL) {
    throw new Error("CMS url is not set");
  }
  const res = await fetch(new URL(path, CMS_URL).toString(), {
    headers: CMS_TOKEN ? { Authorization: `Bearer ${CMS_TOKEN}` } : undefined,
    // кэш страницы управляется вызывающей стороной
  });
  if (!res.ok) {
    throw new Error(`CMS error: ${res.status}`);
  }
  return await res.json() as T;
}

export async function getCmsProducts(): Promise<CmsProduct[]> {
  try {
    // пример: /api/products?populate=image
    const data = await cmsFetch<CmsResponse<CmsProductData>>("/api/products?populate=image");
    return data.data.map((p) => ({
      id: p.id,
      slug: p.attributes?.slug ?? String(p.id),
      name: p.attributes?.name ?? "Product",
      shortDescription: p.attributes?.shortDescription ?? "",
      description: p.attributes?.description ?? "",
      category: p.attributes?.category ?? "packaged",
      image:
        p.attributes?.image?.data?.attributes?.url ??
        p.attributes?.image?.url ??
        undefined,
      priceFrom: p.attributes?.priceFrom ?? undefined,
      unit: p.attributes?.unit ?? undefined,
    }));
  } catch {
    return [];
  }
}

export type CmsPost = {
  id: string | number;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  cover?: { url: string } | string;
  tags?: string[];
  content?: string;
};

interface CmsPostData {
  id: number;
  attributes: {
    slug?: string;
    title?: string;
    excerpt?: string;
    date?: string;
    cover?: {
      data?: {
        attributes?: {
          url?: string;
        };
      };
      url?: string;
    };
    tags?: string[];
    content?: string;
  };
}

export async function getCmsPosts(): Promise<CmsPost[]> {
  try {
    const data = await cmsFetch<CmsResponse<CmsPostData>>("/api/posts?populate=cover");
    return data.data.map((p) => ({
      id: p.id,
      slug: p.attributes?.slug ?? String(p.id),
      title: p.attributes?.title ?? "",
      excerpt: p.attributes?.excerpt ?? "",
      date: p.attributes?.date ?? "",
      cover:
        p.attributes?.cover?.data?.attributes?.url ??
        p.attributes?.cover?.url ??
        undefined,
      tags: p.attributes?.tags ?? [],
      content: p.attributes?.content ?? "",
    }));
  } catch {
    return [];
  }
}

export type CmsRecipe = {
  id: string | number;
  slug: string;
  title: string;
  time?: string;
  steps?: string[];
  tags?: string[];
};

interface CmsRecipeData {
  id: number;
  attributes: {
    slug?: string;
    title?: string;
    time?: string;
    steps?: string[];
    tags?: string[];
  };
}

export async function getCmsRecipes(): Promise<CmsRecipe[]> {
  try {
    const data = await cmsFetch<CmsResponse<CmsRecipeData>>("/api/recipes");
    return data.data.map((r) => ({
      id: r.id,
      slug: r.attributes?.slug ?? String(r.id),
      title: r.attributes?.title ?? "",
      time: r.attributes?.time ?? "",
      steps: r.attributes?.steps ?? [],
      tags: r.attributes?.tags ?? [],
    }));
  } catch {
    return [];
  }
}

export type CmsDoc = {
  id: string | number;
  title: string;
  href: string;
};

interface CmsDocData {
  id: number;
  attributes: {
    title?: string;
    file?: {
      data?: {
        attributes?: {
          url?: string;
        };
      };
      url?: string;
    };
  };
}

export async function getCmsDocs(): Promise<CmsDoc[]> {
  try {
    const data = await cmsFetch<CmsResponse<CmsDocData>>("/api/documents?populate=file");
    return data.data.map((d) => ({
      id: d.id,
      title: d.attributes?.title ?? "Документ",
      href:
        d.attributes?.file?.data?.attributes?.url ??
        d.attributes?.file?.url ??
        "#",
    }));
  } catch {
    return [];
  }
}

export type CmsStore = {
  id: string | number;
  title: string;
  lat: number;
  lng: number;
  address?: string;
};

interface CmsStoreData {
  id: number;
  attributes: {
    title?: string;
    lat?: number;
    lng?: number;
    address?: string;
  };
}

export async function getCmsStores(): Promise<CmsStore[]> {
  try {
    const data = await cmsFetch<CmsResponse<CmsStoreData>>("/api/stores");
    return data.data.map((s) => ({
      id: s.id,
      title: s.attributes?.title ?? "Точка продаж",
      lat: Number(s.attributes?.lat ?? 0),
      lng: Number(s.attributes?.lng ?? 0),
      address: s.attributes?.address ?? "",
    }));
  } catch {
    return [];
  }
}


