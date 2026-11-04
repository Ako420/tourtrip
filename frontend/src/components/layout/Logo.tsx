import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary sm:text-[1.75rem]">
      Hotel<span className="text-accent">.</span>Jr
    </Link>
  );
};

export default Logo;
