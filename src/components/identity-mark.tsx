// Three cut ribbons form an open A. Shared by the identity study and chapter marks.
export function IdentityMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">
    <path className="identity-fold" d="M18 180 86 20h25L44 180Z" />
    <path className="identity-fold" d="M117 20h22l55 160h-26Z" />
    <path className="identity-fold" d="M59 117h99l9 24H49Z" />
  </svg>;
}
