"use client";
import React from "react";
import { useParams } from "next/navigation";
import CategoryForm from "../../category/CategoryForm";

const UpdateCategory = () => {
  const params = useParams();

  return (
    <CategoryForm
      mode="update"
      isSubcategory={true}
      categoryId={String(params?.id)}
    />
  );
};

export default UpdateCategory;
