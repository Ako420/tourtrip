import type { ReactNode } from "react";
import type { IconName } from "@/constants";
import Icon from "./Icon";

type StatusMessageProps = {
  iconName: IconName;
  title: string;
  description: string;
  children?: ReactNode;
};

const StatusMessage = ({ iconName, title, description, children }: StatusMessageProps) => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary-soft text-2xl text-primary">
        <Icon name={iconName} />
      </span>
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default StatusMessage;
