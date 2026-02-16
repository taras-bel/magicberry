import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

type Props = {
  title: string;
  text: string;
  image: string;
  cta: { href: string; label: string };
  reverse?: boolean;
  tone?: "berry" | "sage" | "amber";
};

export default function SplitBlock({
  title,
  text,
  image,
  cta,
  reverse,
}: Props) {
  return (
    <section className="py-24 border-t border-gray-200 bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
      {/* Premium decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute ${reverse ? "right-0" : "left-0"} top-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl`} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2 lg:gap-24">
          <div className={`${reverse ? "order-2 lg:order-1" : ""} space-y-8`}>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight tracking-tight">
                {title}
              </h2>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl font-normal">
              {text}
            </p>
            <div className="pt-4">
              <Link href={cta.href} className="btn btn-primary text-base px-8 py-4">
                {cta.label}
              </Link>
            </div>
          </div>
          <Reveal>
            <div className={`${reverse ? "order-1 lg:order-2" : ""}`}>
              <div className="aspect-[4/3] relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
