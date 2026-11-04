import Link from "next/link";

type TermsCheckboxProps = {
  error?: string;
};

const TermsCheckbox = ({ error }: TermsCheckboxProps) => {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2 text-sm">
        <input type="checkbox" name="acceptTerms" aria-invalid={Boolean(error)} className="mt-0.5 size-4 accent-primary" />
        <span>
          I agree to the{" "}
          <Link href="/terms" target="_blank" className="text-primary hover:underline">
            booking terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" target="_blank" className="text-primary hover:underline">
            privacy statement
          </Link>
          .
        </span>
      </label>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default TermsCheckbox;
