import { parseGuideBody } from "@/lib";
import AppImage from "../ui/AppImage";

type GuideArticleProps = {
  body: string;
  imageUrl: string;
};

const GuideArticle = ({ body, imageUrl }: GuideArticleProps) => {
  const [intro, ...blocks] = parseGuideBody(body);

  return (
    <article className="mx-auto mt-6 max-w-content">
      {intro && <p className="text-ink-soft">{intro.text}</p>}

      <div className="relative mt-5 aspect-[3/2] overflow-hidden rounded-card bg-surface-alt">
        <AppImage src={imageUrl} alt="" fill priority sizes="(min-width: 1280px) 72rem, 100vw" className="object-cover" />
      </div>

      {blocks.map((block, index) =>
        block.type === "heading" ? (
          <h2 key={block.text} className="mt-10 mb-3 text-2xl font-bold">
            {block.text}
          </h2>
        ) : (
          <p key={index} className="mt-3 text-ink-soft">
            {block.text}
          </p>
        ),
      )}
    </article>
  );
};

export default GuideArticle;
