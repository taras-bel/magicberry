export type Category =
  | "weight" // Весовая продукция
  | "packaged" // Фасованная продукция
  | "syrup" // Сиропы
  | "must"; // Сусла

export type Product = {
  id: string;
  slug: string;
  name: string;
  name_en?: string;
  shortDescription?: string;
  shortDescription_en?: string;
  description?: string;
  description_en?: string;
  category: Category;
  image?: string;
  placeholder?: string;
  priceFrom?: number; // базовая цена, если уместно
  unit?: string; // кг, шт, л
  tags?: string[];
  rating?: number; // рейтинг продукта
};
