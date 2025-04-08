"use client";
import axiosInstance from "@/api";
import { fetchSubCategories } from "@/api/apiFuntions";
import { FormInput } from "@/components/FormInput";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type CategoryFormProps = {
  mode: "create" | "update";
  isSubcategory: boolean;
  categoryId?: string;
  onSubmit?: (formData: any) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  mode,
  isSubcategory,
  categoryId,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);  // To store fetched subcategories
  const [image, setImage] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (isSubcategory) {
          const { data } = await axiosInstance.get("category");
          setCategories(data?.data ?? []);
        }
        if (mode === "update" && categoryId) {
          const { data } = await axiosInstance.get(`/category/${categoryId}`);
          setFormData(data?.data ?? {});

          // Fetch subcategories when in update mode and categoryId exists
          const subcategoryData = await fetchSubCategories(categoryId);  // Fetch subcategories
          setSubcategories(subcategoryData?.data?.data ?? []);  // Set subcategories
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [mode, isSubcategory, categoryId]);

  const handleChange = (id: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSubmit = new FormData() as any;

      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      if (image) {
        formDataToSubmit.append("image_url", image);
      }

      if (mode === "create") {
        await axiosInstance.post("/category", formDataToSubmit);
      } else {
        await axiosInstance.put(`/category/${categoryId}`, formDataToSubmit);
      }

      toast.success(`${mode === "create" ? "Created" : "Updated"} category successfully!`);
      router.push('/category');
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

 

  const categoryFormFields = [
    {
      id: "name",
      label: "category.form.name",
      type: "text",
      required: true,
    },
    {
      id: "description",
      label: "category.form.description",
      type: "text",
    },
    {
      id: "image_url",
      label: "category.form.imageUrl",
      type: "file",
    },
  ];

  return (
    <>
      {!loading && (
        <div className="col-span-full flex justify-end mb-4">
          <Button onClick={handleSubmit} type="submit" disabled={loading}>
            {mode === "create" ? "Create" : "Update"}
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 parent">
        {loading && (
          <div className="col-span-full mb-4">
            <Spinner isLoading={true} />
          </div>
        )}

        {!loading && categoryFormFields.map((field, index) => (
          <div key={index} className="mb-4">
            {field.type === "file" ? (
              <>
                <Label htmlFor="file" className="mb-2">Image</Label>
                <Input
                  id={field.id}
                  type="file"
                  onChange={handleFileChange}
                  required={field.required}
                />
              </>
            ) : (
              <FormInput
                key={field.id}
                field={field as any}
                value={formData[field.id]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        {!loading && isSubcategory && (
          <div className="col-span-full mb-4">
            <label className="block mb-1 text-sm font-medium">
              category.form.parentCategory
            </label>
            <Select
              onValueChange={(value) => handleChange("parent_category_id", value)}
              value={formData.parent_category_id || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a parent category" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 space-y-2 flex gap-2">
                  <Input
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="button" onClick={() => {}}>
                    {dropdownLoading ? "Please wait..." : "Search"}
                  </Button>
                </div>
                <div className="max-h-60 overflow-auto">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No categories found.
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show subcategories as badges */}
        {!loading && mode === "update" && subcategories.length > 0 && (
          <div className="col-span-full mb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sub-categories">Sub Categories</Label>
              <div className="flex gap-5 ">

              {subcategories.map((sub) => (
                <Link className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full" key={sub._id} href={`/subcategory/${sub._id}`} >
                  {sub.name}
                </Link>
              ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default CategoryForm;
