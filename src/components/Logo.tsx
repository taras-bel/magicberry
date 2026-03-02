import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <span className="font-serif text-2xl font-semibold tracking-wide text-primary group-hover:text-berry transition-colors duration-300">
        LATVBELFRUITS
      </span>
    </Link>
  );
}
