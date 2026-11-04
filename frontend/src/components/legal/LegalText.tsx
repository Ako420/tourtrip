type LegalTextProps = {
  text: string;
};

// Highlights [placeholders] so unfinished wording cannot be missed.
const LegalText = ({ text }: LegalTextProps) => {
  return text.split(/(\[[^\]]+\])/).map((part, index) => {
    return part.startsWith("[") ? (
      <mark key={index} className="rounded-sm bg-accent-soft px-1 text-ink">
        {part}
      </mark>
    ) : (
      part
    );
  });
};

export default LegalText;
