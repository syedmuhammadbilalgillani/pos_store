"use client";
import axiosInstance from "@/api";
import Button from "@/components/Button";
import Input from "@/components/Input"; // Your reusable Input component
import TranslatedText from "@/components/Language/TranslatedText";
import { toast } from "@/components/Toast/toast_manager";
import { FormField, TenantStoreUserDto, UserRole } from "@/constant/types";
import React, { useState } from "react";

const TenantStoreUserForm: React.FC = () => {
  const [formData, setFormData] = useState<TenantStoreUserDto>({
    tenant_name: "",
    tenant_contactEmail: "",
    tenant_contactPhone: "",
    tenant_isActive: true,
    tenant_dbConnectionString: "",
    tenant_settings: {},
    store_name: "",
    store_address: "",
    store_city: "",
    store_state: "",
    store_zipCode: "",
    store_phone: "",
    store_email: "",
    store_timezone: "",
    store_settings: {},
    user_firstName: "",
    user_lastName: "",
    user_email: "",
    user_passwordHash: "",
    user_phone: "",
    user_role: UserRole.ADMIN,
    user_isActive: true,
    user_permissions: {},
  });

  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    target: "", // 'tenant_settings', 'store_settings', or 'user_permissions'
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const formFields: FormField[] = [
    // Tenant Fields
    {
      id: "tenant_name",
      label: "tenant.form.tenantName",
      type: "text",
      required: true,
    },
    {
      id: "tenant_contactEmail",
      label: "tenant.form.tenantContactEmail",
      type: "email",
      required: true,
    },
    {
      id: "tenant_contactPhone",
      label: "tenant.form.tenantContactPhone",
      type: "tel",
    },
    {
      id: "tenant_isActive",
      label: "tenant.form.tenantIsActive",
      type: "checkbox",
    },
    {
      id: "tenant_dbConnectionString",
      label: "tenant.form.tenantDbConnectionString",
      type: "text",
      required: true,
    },

    // Store Fields
    {
      id: "store_name",
      label: "tenant.form.storeName",
      type: "text",
      required: true,
    },
    { id: "store_address", label: "tenant.form.storeAddress", type: "text" },
    { id: "store_city", label: "tenant.form.storeCity", type: "text" },
    { id: "store_state", label: "tenant.form.storeState", type: "text" },
    { id: "store_zipCode", label: "tenant.form.storeZipCode", type: "text" },
    { id: "store_phone", label: "tenant.form.storePhone", type: "tel" },
    { id: "store_email", label: "tenant.form.storeEmail", type: "email" },
    { id: "store_timezone", label: "tenant.form.storeTimezone", type: "text" },

    // User Fields
    {
      id: "user_firstName",
      label: "tenant.form.userFirstName",
      type: "text",
      required: true,
    },
    {
      id: "user_lastName",
      label: "tenant.form.userLastName",
      type: "text",
      required: true,
    },
    {
      id: "user_email",
      label: "tenant.form.userEmail",
      type: "email",
      required: true,
    },
    {
      id: "user_passwordHash",
      label: "tenant.form.userPasswordHash",
      type: "password",
      required: true,
    },
    {
      id: "user_phone",
      label: "tenant.form.userPhone",
      type: "tel",
      required: true,
    },
    {
      id: "user_role",
      label: "tenant.form.userRole",
      type: "select",
      options: Object.values(UserRole),
      required: true,
    },
    {
      id: "user_isActive",
      label: "tenant.form.userIsActive",
      type: "checkbox",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSetting = () => {
    if (!newSetting.key || !newSetting.value || !newSetting.target) return;

    setFormData((prev) => ({
      ...prev,
      [newSetting.target]: {
        ...(prev[newSetting.target as keyof TenantStoreUserDto] as Record<
          string,
          any
        >),
        [newSetting.key]: newSetting.value,
      },
    }));

    setNewSetting({
      key: "",
      value: "",
      target: newSetting.target,
    });
  };

  const handleRemoveSetting = (prefix: string, key: string) => {
    setFormData((prev) => {
      const currentSettings = {
        ...(prev[prefix as keyof TenantStoreUserDto] as Record<string, any>),
      };
      delete currentSettings[key];
      return { ...prev, [prefix]: currentSettings };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    try {
      const payload = {
        ...formData,
        tenant_contactPhone: formData.tenant_contactPhone || undefined,
        store_address: formData.store_address || undefined,
        store_city: formData.store_city || undefined,
        store_state: formData.store_state || undefined,
        store_zipCode: formData.store_zipCode || undefined,
        store_phone: formData.store_phone || undefined,
        store_email: formData.store_email || undefined,
        store_timezone: formData.store_timezone || undefined,
      };
      console.log(payload);

      const response = await axiosInstance.post("/tenant", payload);
      console.log("Form submitted successfully:", response.data);

      // Display success message
      if (response.data.success) {
        setFormData({
          tenant_name: "",
          tenant_contactEmail: "",
          tenant_contactPhone: "",
          tenant_isActive: true,
          tenant_dbConnectionString: "",
          tenant_settings: {},
          store_name: "",
          store_address: "",
          store_city: "",
          store_state: "",
          store_zipCode: "",
          store_phone: "",
          store_email: "",
          store_timezone: "",
          store_settings: {},
          user_firstName: "",
          user_lastName: "",
          user_email: "",
          user_passwordHash: "",
          user_phone: "",
          user_role: UserRole.ADMIN,
          user_isActive: true,
          user_permissions: {},
        });
        toast.success(response.data.message); // or use a toast notification library
      } else {
        toast.error(response.data.message); // or use a toast notification library
        // setFormData({
        //   tenant_name: "",
        //   tenant_contactEmail: "",
        //   tenant_contactPhone: "",
        //   tenant_isActive: true,
        //   tenant_dbConnectionString: "",
        //   tenant_settings: {},
        //   store_name: "",
        //   store_address: "",
        //   store_city: "",
        //   store_state: "",
        //   store_zipCode: "",
        //   store_phone: "",
        //   store_email: "",
        //   store_timezone: "",
        //   store_settings: {},
        //   user_firstName: "",
        //   user_lastName: "",
        //   user_email: "",
        //   user_passwordHash: "",
        //   user_phone: "",
        //   user_role: UserRole.ADMIN,
        //   user_isActive: true,
        //   user_permissions: {},
        // });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Display error message
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // or use a toast notification library
      } else {
        toast.error("An unexpected error occurred. Please try again."); // or use a toast notification library
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const renderSettings = (settings: Record<string, any>, prefix: string) => {
    return (
      <div className="space-y-3">
        {Object.entries(settings).map(([key, value]) => (
          <div key={`${prefix}_${key}`} className="flex items-center space-x-2">
            <Input
              id={`${prefix}_${key}`}
              label={key}
              type="text"
              value={value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [prefix]: {
                    ...(prev[prefix as keyof TenantStoreUserDto] as any),
                    [key]: e.target.value,
                  },
                }))
              }
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => handleRemoveSetting(prefix, key)}
              className="mt-7 p-2 text-red-500 hover:text-red-700"
            >
              <TranslatedText textKey="remove" />
            </button>
          </div>
        ))}

        <div className="mt-4 p-3 border border-dashed border-gray-300 rounded-md">
          <h4 className="text-sm font-medium mb-2">
            <TranslatedText textKey="tenant.form.addSetting" />
          </h4>
          <div className="flex items-end space-x-2">
            <Input
              label="key"
              type="text"
              value={newSetting.target === prefix ? newSetting.key : ""}
              onChange={(e) =>
                setNewSetting({
                  ...newSetting,
                  key: e.target.value,
                  target: prefix,
                })
              }
              className="flex-grow"
            />
            <Input
              label="value"
              type="text"
              value={newSetting.target === prefix ? newSetting.value : ""}
              onChange={(e) =>
                setNewSetting({
                  ...newSetting,
                  value: e.target.value,
                  target: prefix,
                })
              }
              className="flex-grow"
            />
            <button
              type="button"
              onClick={handleAddSetting}
              disabled={
                !newSetting.key ||
                !newSetting.value ||
                newSetting.target !== prefix
              }
              className="mb-4 px-4 py-2 bg-green-500 text-white dark:text-black rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              <TranslatedText textKey="add" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-6 bg-white dark:bg-[#15181E] text-gray-900 dark:text-gray-100 h-[88vh] overflow-auto"
    >
      <div className="flex justify-end sticky top-0 right-0">
        {/* Submit Button */}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          tenant.submit
        </Button>
      </div>
      {/* Tenant Section */}
      <section aria-labelledby="tenant-heading">
        <h2 id="tenant-heading" className="text-xl font-bold mb-4">
          <TranslatedText textKey="tenant.tenantInfo" />
        </h2>
        <div className="border-b pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formFields
            .filter(
              (field) =>
                field.id.startsWith("tenant_") && field.id !== "tenant_settings"
            )
            .map((field) =>
              field.type === "select" ? (
                <div key={field.id} className="mb-4">
                  <label
                    htmlFor={field.id}
                    className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  <select
                    id={field.id}
                    value={formData[field.id] as string}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type as any}
                  value={
                    field.type === "checkbox"
                      ? undefined
                      : (formData[field.id] as string) || ""
                  }
                  checked={
                    field.type === "checkbox"
                      ? (formData[field.id] as boolean)
                      : undefined
                  }
                  onChange={handleChange}
                  required={field.required}
                />
              )
            )}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold mt-4">
              <TranslatedText textKey="tenant.tenantSetting" />
            </h3>
            {renderSettings(formData.tenant_settings, "tenant_settings")}
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section aria-labelledby="store-heading">
        <h2 id="store-heading" className="text-xl font-bold mb-4">
          <TranslatedText textKey="tenant.storeInfo" />
        </h2>
        <div className="border-b pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formFields
            .filter(
              (field) =>
                field.id.startsWith("store_") && field.id !== "store_settings"
            )
            .map((field) => (
              <Input
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type as any}
                value={(formData[field.id] as string) || ""}
                onChange={handleChange}
                required={field.required}
              />
            ))}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold mt-4">
              <TranslatedText textKey="tenant.storeSetting" />
            </h3>
            {renderSettings(formData.store_settings, "store_settings")}
          </div>
        </div>
      </section>

      {/* User Section */}
      <section aria-labelledby="user-heading">
        <h2 id="user-heading" className="text-xl font-bold mb-4">
          <TranslatedText textKey="tenant.userInfo" />
        </h2>
        <div className="border-b pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formFields
            .filter(
              (field) =>
                field.id.startsWith("user_") && field.id !== "user_permissions"
            )
            .map((field) =>
              field.type === "select" ? (
                <div key={field.id} className="mb-4">
                  <label
                    htmlFor={field.id}
                    className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <TranslatedText textKey={field.label} />
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  <select
                    id={field.id}
                    value={formData[field.id] as string}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type as any}
                  value={
                    field.type === "checkbox"
                      ? undefined
                      : (formData[field.id] as string) || ""
                  }
                  checked={
                    field.type === "checkbox"
                      ? (formData[field.id] as boolean)
                      : undefined
                  }
                  onChange={handleChange}
                  required={field.required}
                />
              )
            )}
          <div className="col-span-full">
            <h3 className="text-lg font-semibold mt-4">
              <TranslatedText textKey="tenant.userPermission" />
            </h3>
            {renderSettings(formData.user_permissions, "user_permissions")}
          </div>
        </div>
      </section>
    </form>
  );
};

export default TenantStoreUserForm;
