import Link from "next/link";
import Image from "next/image";

export default function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <Link href="/" className="font-display flex items-center text-xl font-bold">
      <Image
        src="/logo.png"
        alt="logo"
        width="30"
        height="30"
        className="mr-2 rounded-sm"
      ></Image>
      {showText && <p>blocks</p>}
    </Link>
  );
}
