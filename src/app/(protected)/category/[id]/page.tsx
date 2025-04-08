"use client";
import React from "react";
import CategoryForm from "../CategoryForm";
import { useParams } from "next/navigation";

const UpdateCategory = () => {
  const params = useParams();

  return (
    <CategoryForm
      mode="update"
      isSubcategory={false}
      categoryId={String(params?.id)}
    />
  );
};

export default UpdateCategory;
