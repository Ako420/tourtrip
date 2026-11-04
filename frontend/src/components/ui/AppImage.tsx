import Image, { type ImageProps } from "next/image";

// The image optimizer rejects SVGs, so the sample illustrations are served as they are.
const AppImage = ({ src, alt, ...props }: ImageProps) => {
  return <Image src={src} alt={alt} unoptimized={String(src).endsWith(".svg")} {...props} />;
};

export default AppImage;
