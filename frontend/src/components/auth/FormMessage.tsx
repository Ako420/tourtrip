import Icon from "../ui/Icon";

type FormMessageProps = {
  message?: string;
};

const FormMessage = ({ message }: FormMessageProps) => {
  if (!message) return null;

  return (
    <p role="alert" className="flex items-center gap-2 rounded-md bg-danger-soft px-3 py-2.5 text-sm text-danger">
      <Icon name="error" />
      {message}
    </p>
  );
};

export default FormMessage;
