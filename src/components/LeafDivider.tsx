export default function LeafDivider() {
  return (
    <div className="my-12 flex justify-center">
      <div className="relative">
        <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[color:var(--accent)] opacity-60">
          <path d="M15 12C11 12 7 10 6 7C8 10 12 11 15 11C18 11 22 10 24 7C23 10 19 12 15 12Z" fill="currentColor"/>
          <circle cx="40" cy="12" r="3" fill="currentColor" className="animate-pulse"/>
          <path d="M65 12C69 12 73 10 74 7C72 10 68 11 65 11C62 11 58 10 56 7C57 10 61 12 65 12Z" fill="currentColor"/>
        </svg>

        {/* Декоративные точки */}
        <div className="absolute -top-1 left-8 w-1 h-1 rounded-full animate-ping bg-[color:var(--accent)] opacity-50"></div>
        <div className="absolute -top-1 right-8 w-1 h-1 rounded-full animate-ping delay-300 bg-[color:var(--accent-gold)] opacity-60"></div>
      </div>
    </div>
  );
}


