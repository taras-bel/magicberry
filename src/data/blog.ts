export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  cover?: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "kak-my-vyalyvaem-yagody",
    title: "Как мы вялим ягоды: бережная технология",
    excerpt: "Рассказываем о процессе бережного вяления без диоксида серы и красителей.",
    date: "2025-01-12",
    cover: "/images/products/cranberry-1200.webp",
    content: [
      "Мы используем собственную запатентованную технологию дегидратации при щадящих температурах.",
      "Так мы сохраняем вкус, аромат и максимальную пользу сырья.",
    ],
  },
  {
    slug: "syrupy-dlya-napitkov",
    title: "Натуральные сиропы для напитков и десертов",
    excerpt: "Как правильно использовать сиропы Latvbelfruits в баре и на кухне.",
    date: "2025-02-03",
    cover: "/images/products/fruit-mix-1200.webp",
    content: [
      "Наши сиропы быстро растворяются и сохраняют стабильный вкус.",
      "Идеальны для лимонадов, коктейлей и десертов.",
    ],
  },
  {
    slug: "polza-vyalenyh-yagod",
    title: "Польза вяленых ягод",
    excerpt: "Почему вяленая клюква и вишня — отличный выбор для перекуса.",
    date: "2025-03-18",
    cover: "/images/products/cherry-dried-1200.webp",
    content: [
      "Вяленые ягоды — это концентрированный вкус и натуральные сахара.",
      "Они хорошо хранятся и подходят для выпечки и снеков.",
    ],
  },
];


