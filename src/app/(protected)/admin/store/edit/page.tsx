"use client";
import { fetchStoreData, updateStoreData } from "@/api/apiFuntions";
import Input from "@/components/Input";
import Spinner from "@/components/Spinner";
import { TenantFormData } from "@/constant/types";
import { useTenantStore } from "@/stores/tenantStore";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const EditStore = React.memo(() => {
  const tenant = useTenantStore((state) => state.tenant);
  const [formData, setFormData] = useState<TenantFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    timezone: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const setTenant = useTenantStore((state) => state.setTenant);
  const [isLoading, setIsLoading] = useState(false);
  // Use useMemo for inputFields to prevent recreating on each render
  const inputFields = useMemo(
    () => [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "address", label: "Address", type: "text", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text", required: true },
      { name: "zipCode", label: "Zip Code", type: "text", required: true },
      { name: "timezone", label: "Timezone", type: "text", required: true },
    ],
    []
  );

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        address: tenant.address || "",
        city: tenant.city || "",
        state: tenant.state || "",
        zipCode: tenant.zipCode || "",
        timezone: tenant.timezone || "",
        logoUrl: tenant.logoUrl || "",
      });
      setPreviewUrl(tenant.logoUrl || "/placeholder.jpg");
    }
  }, [tenant]);

  // Use useCallback for handlers to prevent recreation on each render
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Clean up the preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== tenant?.logoUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, tenant?.logoUrl]);

  // Make file change handler use useCallback
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // File size validation (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size should be less than 5MB");
          return;
        }

        // File type validation
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }

        setLogoFile(file);
        // Clean up any existing preview URL first
        if (previewUrl && previewUrl !== tenant?.logoUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      }
    },
    [previewUrl, tenant?.logoUrl]
  );

  // Make submit handler use useCallback
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        // Create the DTO object
        const updateStoreDto = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          timezone: formData.timezone,
        };

        const response = await updateStoreData(
          tenant?._id as string,
          updateStoreDto,
          logoFile || undefined
        );

        if (response) {
          setIsLoading(false);

          toast.success("Store details updated successfully");
          const data = await fetchStoreData();
          setTenant(data[0]);
          //   setIsStoreDetailDialogueOpen(false);
        }
      } catch (error) {
        setIsLoading(false);

        toast.error("Failed to update store details");
        // console.error("Error updating store:", error);
      }
    },
    [formData, logoFile, tenant?._id, setTenant]
  );

  // Improve performance of the image component
  const logoPreview = useMemo(
    () => (
      <Image
        src={previewUrl || tenant?.logoUrl || "/placeholder.jpg"}
        alt={`${tenant?.name || "Company"} Logo Preview`}
        width={100}
        height={100}
        className="rounded-full object-cover mb-4"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = "/placeholder.jpg";
        }}
      />
    ),
    [previewUrl, tenant?.logoUrl, tenant?.name]
  );

  return (
    <>
      <Spinner isLoading={isLoading} />
      <form onSubmit={handleSubmit} className="space-y-4 parent">
        {/* Logo Upload Section */}
        <div className="flex flex-col items-center mb-6">
          {logoPreview}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              Upload New Logo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload logo image"
              />
            </label>
            <span className="text-sm text-gray-500 mt-2">
              Recommended: 100x100px, Max 5MB
            </span>
          </div>
        </div>

        {/* Other Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type as any}
              name={field.name}
              value={formData[field.name as keyof TenantFormData]}
              onChange={handleInputChange}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full"
            />
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Update Tenant Details
          </button>
        </div>
      </form>
    </>
  );
});
export default EditStore;
