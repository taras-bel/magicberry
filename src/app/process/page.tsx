import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Технология производства",
  description: "Запатентованная технология бережного вяления ягод и фруктов. Процесс производства натуральных продуктов без консервантов.",
};

const processSteps = [
  {
    step: 1,
    title: "Отбор и подготовка сырья",
    description: "Мы тщательно отбираем только спелые и качественные ягоды и фрукты у проверенных поставщиков. Сырье проходит первичную обработку и калибровку.",
    details: [
      "Ручной отбор спелых ягод",
      "Удаление посторонних примесей",
      "Калибровка по размеру",
      "Промывка и подготовка к обработке"
    ],
    icon: "🌱",
    image: "/images/products/cranberry-1200.webp"
  },
  {
    step: 2,
    title: "Бережное вяление",
    description: "Основной этап производства — запатентованная технология бережного вяления при контролируемых температурных режимах.",
    details: [
      "Контролируемая температура 35-45°C",
      "Оптимальная влажность воздуха",
      "Естественная циркуляция воздуха",
      "Время обработки 12-48 часов"
    ],
    icon: "🌡️",
    image: "/images/products/cranberry-heap-1200.webp"
  },
  {
    step: 3,
    title: "Контроль качества",
    description: "Каждая партия продукции проходит многоступенчатый контроль качества в собственной лаборатории.",
    details: [
      "Визуальный контроль внешнего вида",
      "Лабораторные испытания",
      "Определение влажности",
      "Микробиологические исследования"
    ],
    icon: "🔬",
    image: "/images/products/fruit-mix-1200.webp"
  },
  {
    step: 4,
    title: "Фасовка и упаковка",
    description: "Продукция фасуется в герметичную упаковку, которая обеспечивает длительное хранение и сохраняет все полезные свойства.",
    details: [
      "Вакуумная упаковка",
      "Герметичная упаковка",
      "Маркировка с указанием срока годности",
      "Подготовка к отгрузке"
    ],
    icon: "📦",
    image: "/images/products/golden-berries-1200.webp"
  }
];

const technologyBenefits = [
  {
    title: "Сохранение витаминов",
    description: "Бережная обработка сохраняет до 90% витаминов и микроэлементов",
    icon: "💚",
    value: "90%"
  },
  {
    title: "Натуральный вкус",
    description: "Продукт сохраняет оригинальный вкус и аромат свежих ягод",
    icon: "👅",
    value: "100%"
  },
  {
    title: "Без консервантов",
    description: "Полностью натуральная продукция без химических добавок",
    icon: "🌿",
    value: "0%"
  },
  {
    title: "Длительное хранение",
    description: "Продукты хранятся до 12 месяцев в прохладном месте",
    icon: "⏰",
    value: "12 мес"
  }
];

const comparisonData = [
  {
    aspect: "Температура обработки",
    traditional: "Высокая (>80°C)",
    ourMethod: "Низкая (35-45°C)"
  },
  {
    aspect: "Сохранение витаминов",
    traditional: "30-50%",
    ourMethod: "85-95%"
  },
  {
    aspect: "Время обработки",
    traditional: "Несколько часов",
    ourMethod: "12-48 часов"
  },
  {
    aspect: "Энергопотребление",
    traditional: "Высокое",
    ourMethod: "Низкое"
  },
  {
    aspect: "Консерванты",
    traditional: "Необходимы",
    ourMethod: "Не требуются"
  }
];

export default function ProcessPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white py-20 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  Технология производства
                </h1>
              </div>
              <p className="text-xl text-gray-600 font-normal leading-relaxed mb-8">
                Запатентованная технология бережного вяления позволяет создавать натуральные
                продукты высочайшего качества без использования консервантов и химических добавок.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#process" className="btn btn-primary">
                  Посмотреть процесс
                </a>
                <Link href="/about" className="btn btn-secondary">
                  О компании
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/products/cranberry-heap-1200.webp"
                alt="Процесс производства Magic Berry"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Benefits */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Преимущества нашей технологии
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              Почему наша технология вяления лучше традиционных методов
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {technologyBenefits.map((benefit, index) => (
              <div key={index} className="card-premium p-6 text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <div className="text-4xl font-bold text-accent mb-2">{benefit.value}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm font-normal">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process" className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Этапы производства
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              От сырья до готового продукта — полный цикл производства
            </p>
          </div>

          <div className="space-y-16">
            {processSteps.map((step, index) => (
              <div key={index} className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} space-y-6`}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white font-bold text-lg shadow-sm">
                      {step.step}
                    </div>
                    <div className="text-4xl">{step.icon}</div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-6 font-normal leading-relaxed">{step.description}</p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Что происходит на этом этапе:</h4>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-600 font-normal">
                            <span className="text-accent font-semibold">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} relative`}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={500}
                    height={350}
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5 justify-center">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                Сравнение технологий
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-normal leading-relaxed">
              Почему наша технология лучше традиционных методов сушки
            </p>
          </div>

          <div className="card-premium overflow-hidden">
            <div className="grid md:grid-cols-3">
              <div className="bg-gray-50 p-6 text-center border-r border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Показатель</h3>
              </div>
              <div className="bg-red-50 p-6 text-center border-r border-gray-200">
                <h3 className="font-semibold text-red-800 mb-2">Традиционная сушка</h3>
                <p className="text-red-600 text-sm font-normal">Высокотемпературная обработка</p>
              </div>
              <div className="bg-green-50 p-6 text-center">
                <h3 className="font-semibold text-green-800 mb-2">Наша технология</h3>
                <p className="text-green-600 text-sm font-normal">Бережное вяление</p>
              </div>
            </div>

            {comparisonData.map((item, index) => (
              <div key={index} className="grid md:grid-cols-3 border-t border-gray-200">
                <div className="p-6 bg-gray-50 border-r border-gray-200">
                  <h4 className="font-medium text-gray-900">{item.aspect}</h4>
                </div>
                <div className="p-6 bg-red-50 text-center border-r border-gray-200">
                  <span className="text-red-700 font-medium">{item.traditional}</span>
                </div>
                <div className="p-6 bg-green-50 text-center">
                  <span className="text-green-700 font-medium">{item.ourMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Control */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
                <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                  Контроль качества
                </h2>
              </div>
              <p className="text-gray-600 mb-8 font-normal leading-relaxed text-lg">
                Каждая партия продукции проходит многоступенчатый контроль качества
                в собственной лаборатории с использованием современного оборудования.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="text-green-600 text-xl mt-1 font-semibold">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Визуальный контроль</h4>
                    <p className="text-gray-600 text-sm font-normal">Проверка внешнего вида и однородности продукции</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-green-600 text-xl mt-1 font-semibold">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Лабораторные испытания</h4>
                    <p className="text-gray-600 text-sm font-normal">Определение влажности, витаминов и микроэлементов</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-green-600 text-xl mt-1 font-semibold">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Микробиологические исследования</h4>
                    <p className="text-gray-600 text-sm font-normal">Проверка на патогенные микроорганизмы</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-green-600 text-xl mt-1 font-semibold">✓</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Сенсорный анализ</h4>
                    <p className="text-gray-600 text-sm font-normal">Оценка вкуса, аромата и текстуры продукции</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/products/fruit-mix-1200.webp"
                alt="Контроль качества продукции"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200 bg-gradient-to-br from-accent via-accent-dark to-accent-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">
            Попробуйте нашу продукцию
          </h2>
          <p className="text-white/90 mb-10 text-xl font-normal leading-relaxed">
            Узнайте на себе преимущества натурального вяления
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn btn-secondary bg-white text-accent hover:bg-gray-50">
              Смотреть продукцию
            </Link>
            <Link href="/docs" className="btn bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
              Сертификаты качества
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
