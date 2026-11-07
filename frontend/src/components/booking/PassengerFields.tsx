import type { PassengerSlot } from "@/lib";
import type { ContactDefaults } from "@/types";
import FormField from "../auth/FormField";

type PassengerFieldsProps = {
  slot: PassengerSlot;
  getError: (name: string) => string | undefined;
  contact?: ContactDefaults;
};

const PassengerFields = ({ slot, getError, contact }: PassengerFieldsProps) => {
  const { key, label, type } = slot;

  return (
    <fieldset className="rounded-card border border-line bg-surface p-5">
      <legend className="mb-3 float-left w-full font-bold">{label}</legend>
      <div className="clear-both grid gap-4 sm:grid-cols-3">
        <FormField
          name={`${key}FirstName`}
          label="First name"
          defaultValue={contact?.firstName}
          autoComplete={type === "adult" ? "given-name" : "off"}
          error={getError(`${key}FirstName`)}
        />
        <FormField
          name={`${key}LastName`}
          label="Last name"
          defaultValue={contact?.lastName}
          autoComplete={type === "adult" ? "family-name" : "off"}
          error={getError(`${key}LastName`)}
        />
        <FormField name={`${key}BirthDate`} label="Date of birth" type="date" error={getError(`${key}BirthDate`)} />
      </div>
    </fieldset>
  );
};

export default PassengerFields;
