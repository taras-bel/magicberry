export type RecipeIngredient = {
  name: string; // название ингредиента
  name_en?: string;
  amount?: string; // количество
  amount_en?: string;
  productSlug?: string; // ссылка на продукт из каталога (если есть)
  required: boolean; // обязательно ли для рецепта
};

export type Recipe = {
  slug: string;
  title: string;
  title_en?: string;
  time: string;
  time_en?: string;
  steps: string[];
  steps_en?: string[];
  tags?: string[];
  tags_en?: string[];
  ingredients: RecipeIngredient[]; // ингредиенты рецепта
  difficulty?: 'easy' | 'medium' | 'hard';
  servings?: number;
  image?: string;
  generated?: boolean; // является ли рецепт AI-сгенерированным
  siteProductsUsed?: string[]; // продукты с сайта, использованные в рецепте
};

export const recipes: Recipe[] = [
  {
    slug: "maffiny-s-klyukvoj",
    image: "/images/recipes/muffins-cranberry.png",
    title: "Маффины с вяленой клюквой",
    title_en: "Muffins with Dried Cranberry",
    time: "35 мин",
    time_en: "35 min",
    difficulty: "medium",
    servings: 6,
    ingredients: [
      { name: "Вяленая клюква", name_en: "Dried Cranberry", amount: "50г", amount_en: "50g", productSlug: "vialenaya-klyukva", required: true },
      { name: "Мука", name_en: "Flour", amount: "200г", amount_en: "200g", required: true },
      { name: "Сахар", name_en: "Sugar", amount: "100г", amount_en: "100g", required: true },
      { name: "Яйца", name_en: "Eggs", amount: "2 шт", amount_en: "2 pcs", required: true },
      { name: "Молоко", name_en: "Milk", amount: "100мл", amount_en: "100ml", required: true },
      { name: "Масло сливочное", name_en: "Butter", amount: "50г", amount_en: "50g", required: true },
      { name: "Разрыхлитель", name_en: "Baking Powder", amount: "1 ч.л.", amount_en: "1 tsp", required: false },
    ],
    steps: ["Разогрейте духовку до 180°C", "Смешайте сухие ингредиенты", "Взбейте яйца с сахаром и маслом", "Соедините все ингредиенты, добавьте клюкву", "Разложите по формочкам", "Выпекайте 20–25 мин"],
    steps_en: ["Preheat oven to 180°C", "Mix dry ingredients", "Beat eggs with sugar and butter", "Combine all ingredients, add cranberries", "Fill muffin tins", "Bake for 20–25 min"],
    tags: ["выпечка", "десерты"],
    tags_en: ["baking", "desserts"],
  },
  {
    slug: "limonad-s-syropom",
    image: "/images/recipes/lemonade-syrup.png",
    title: "Лимонад с ягодным сиропом",
    title_en: "Lemonade with Berry Syrup",
    time: "10 мин",
    time_en: "10 min",
    difficulty: "easy",
    servings: 4,
    ingredients: [
      { name: "Натуральный ягодный сироп", name_en: "Natural Berry Syrup", amount: "4 ст.л.", amount_en: "4 tbsp", productSlug: "syrup-yagodnyj", required: true },
      { name: "Вода газированная", name_en: "Sparkling Water", amount: "1л", amount_en: "1L", required: true },
      { name: "Лимон", name_en: "Lemon", amount: "1 шт", amount_en: "1 pc", required: true },
      { name: "Лед", name_en: "Ice", amount: "по вкусу", amount_en: "to taste", required: false },
      { name: "Мята", name_en: "Mint", amount: "несколько листьев", amount_en: "few leaves", required: false },
    ],
    steps: ["Налейте воду со льдом в стаканы", "Добавьте сироп и сок лимона", "Перемешайте и украсьте мятой", "Подавайте охлажденным"],
    steps_en: ["Pour sparkling water with ice into glasses", "Add syrup and lemon juice", "Stir and garnish with mint", "Serve chilled"],
    tags: ["напитки", "летние"],
    tags_en: ["drinks", "summer"],
  },
  {
    slug: "ovsyanka-s-vishnej",
    image: "/images/recipes/oatmeal-cherry.png",
    title: "Овсянка с вяленой вишней",
    title_en: "Oatmeal with Dried Cherry",
    time: "15 мин",
    time_en: "15 min",
    difficulty: "easy",
    servings: 2,
    ingredients: [
      { name: "Вяленая вишня", name_en: "Dried Cherry", amount: "50г", amount_en: "50g", productSlug: "vialennaya-vishnya", required: true },
      { name: "Овсяные хлопья", name_en: "Oat Flakes", amount: "100г", amount_en: "100g", required: true },
      { name: "Молоко", name_en: "Milk", amount: "300мл", amount_en: "300ml", required: true },
      { name: "Мед", name_en: "Honey", amount: "2 ст.л.", amount_en: "2 tbsp", required: false },
      { name: "Корица", name_en: "Cinnamon", amount: "щепотка", amount_en: "pinch", required: false },
      { name: "Орехи", name_en: "Nuts", amount: "20г", amount_en: "20g", required: false },
    ],
    steps: ["Залейте овсянку горячим молоком", "Добавьте вишню и мед", "Варите на среднем огне 10 мин", "Посыпьте корицей и орехами", "Подавайте горячей"],
    steps_en: ["Pour hot milk over oat flakes", "Add cherry and honey", "Cook over medium heat for 10 min", "Sprinkle with cinnamon and nuts", "Serve hot"],
    tags: ["завтрак", "полезное"],
    tags_en: ["breakfast", "healthy"],
  },
  {
    slug: "tykvannye-chipsy",
    image: "/images/recipes/pumpkin-chips.png",
    title: "Чипсы из вяленой тыквы",
    title_en: "Dried Pumpkin Chips",
    time: "5 мин + 4 ч сушки",
    time_en: "5 min + 4h drying",
    difficulty: "easy",
    servings: 4,
    ingredients: [
      { name: "Тыква вяленая", name_en: "Dried Pumpkin", amount: "200г", amount_en: "200g", productSlug: "tykva-konfitiur", required: true },
      { name: "Оливковое масло", name_en: "Olive Oil", amount: "1 ст.л.", amount_en: "1 tbsp", required: false },
      { name: "Соль", name_en: "Salt", amount: "по вкусу", amount_en: "to taste", required: false },
      { name: "Специи", name_en: "Spices", amount: "по вкусу", amount_en: "to taste", required: false },
    ],
    steps: ["Нарежьте тыкву тонкими ломтиками", "Смажьте маслом и посыпьте солью со специями", "Разложите на противне", "Сушите в духовке при 100°C 4 часа"],
    steps_en: ["Slice pumpkin thinly", "Brush with oil and sprinkle with salt and spices", "Arrange on a baking sheet", "Dry in the oven at 100°C for 4 hours"],
    tags: ["закуски", "здоровое"],
    tags_en: ["snacks", "healthy"],
  },
];
