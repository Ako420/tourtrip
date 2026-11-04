"use client";

import ErrorScreen from "@/screens/error/ErrorScreen";

const Error = ({ retry }: { retry: () => void }) => {
  return <ErrorScreen retry={retry} />;
};

export default Error;
