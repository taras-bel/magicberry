export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

export const primaryNav: NavItem[] = [
  { 
    label: "products_group", // Группа "Продукция"
    children: [
      { label: "products", href: "/products" },
      { label: "mixes", href: "/mixes" },
      { label: "gifts", href: "/gifts" },
    ]
  },
  { 
    label: "customers_group", // Группа "Покупателям"
    children: [
      { label: "stores", href: "/stores" },
      { label: "reviews", href: "/reviews" },
      { label: "faq", href: "/faq" },
      { label: "docs", href: "/docs" },
    ]
  },
  { 
    label: "company_group", // Группа "Компания"
    children: [
      { label: "about", href: "/about" },
      { label: "b2b", href: "/b2b" },
      { label: "contacts", href: "/contacts" },
    ]
  },
];
