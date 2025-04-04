import { useRouter } from "next/navigation";
import React from "react";
import Button from "./Button";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button ariaLabel="back button" onClick={() => router.back()}>
      back
    </Button>
  );
};

export default BackButton;
