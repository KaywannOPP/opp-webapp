import Image from "next/image";
import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <Image
        src="/opp-logo.svg" // change to /opp-logo.png if needed
        alt="On Pitch Performance"
        width={28}
        height={28}
        priority
      />
      <span className="text-lg font-semibold tracking-tight">
        On Pitch Performance
      </span>
    </Link>
  );
}
