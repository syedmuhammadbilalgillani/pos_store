import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

const BackButton = () => {
  const router = useRouter();
  return (
    <Button aria-label="back button" variant={'outline'} onClick={() => router.back()}>
      back
    </Button>
  );
};

export default BackButton;
