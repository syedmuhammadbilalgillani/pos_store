"use client";
import axiosInstance from "@/api";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import TranslatedText from "@/components/Language/TranslatedText";
import Spinner from "@/components/Spinner";
import { FormField, UserRole } from "@/constant/types";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchRoles } from "@/api/apiFuntions";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/constant/permissions";
import { FormInput } from "@/components/FormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormProps {
  initialData?: Partial<typeof defaultFormData> | any;
  mode?: "create" | "edit";
}

const defaultFormData = {
  firstName: "",
  lastName: "",
  email: "",
  passwordHash: "",
  phone: "",
  role: "",
  isActive: true,
  permissions: [],
};

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  mode = "create",
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    target: "",
  });
  const { hasPermission } = usePermission();

  const shouldFetchUsers = hasPermission(PERMISSIONS.CREATE_USER);

  const { data: roles, loading } = useFetchData(fetchRoles, {
    enabled: shouldFetchUsers,
  });

  // Convert PERMISSIONS object to array of options for the select component
  const permissionOptions = Object.entries(PERMISSIONS).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  useEffect(() => {
    if (initialData) {
      console.log(initialData, "initial data");
      let role = initialData.role || initialData.role || "";
      setFormData({ ...defaultFormData, ...initialData, role });

      // Initialize permissions if editing
      if (mode === "edit" && initialData.permissions) {
        // Handle both array and object formats for permissions
        let formattedPermissions = [];

        if (Array.isArray(initialData.permissions)) {
          formattedPermissions = initialData.permissions.map(
            (permission: any, index: any) => ({
              key: permission._id || permission.id || index.toString(),
              value: permission.name || permission.value || permission,
            })
          );
        }

        setFormData((prev) => ({
          ...prev,
          permissions: formattedPermissions,
        }));
      }
    }
  }, [initialData, mode]);

  const formFields: any[] = [
    {
      id: "firstName",
      label: "user.form.firstName",
      type: "text",
      required: true,
    },
    {
      id: "lastName",
      label: "user.form.lastName",
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "user.form.email",
      type: "email",
      required: true,
    },
    {
      id: "phone",
      label: "user.form.phone",
      type: "tel",
      required: true,
    },
    {
      id: "role",
      label: "user.form.role",
      type: "select",
      required: true,
      options: roles?.map((role: any) => ({
        label: role?.name ?? "",
        value: role?._id ?? "",
      })),
    },
    {
      id: "isActive",
      label: "user.form.isActive",
      type: "checkbox",
    },
    ...(mode === "create"
      ? [
          {
            id: "passwordHash",
            label: "user.form.password",
            type: "password",
            required: true,
          },
        ]
      : []),
  ];

  const handleAddSetting = () => {
    if (!newSetting.value || !newSetting.target) return;

    setFormData((prev: any) => {
      const current = prev[newSetting.target] ?? [];
      if (!Array.isArray(current)) return prev;

      // Auto-generate key as the index
      const newKey = current.length.toString();

      return {
        ...prev,
        [newSetting.target]: [
          ...current,
          { key: newKey, value: newSetting.value }, // Add key as index and value
        ],
      };
    });

    setNewSetting({
      key: "", // Empty key as it's auto-generated
      value: "",
      target: newSetting.target,
    });
  };

  const handleRemoveSetting = (prefix: string, key: string) => {
    setFormData((prev: any) => {
      const current = prev[prefix] ?? [];
      if (!Array.isArray(current)) return prev;

      return {
        ...prev,
        [prefix]: current.filter((item: any) => item.key !== key), // Remove by key
      };
    });
  };

  const handleAddPermission = (permission: string) => {
    if (!permission) return;

    setFormData((prev: any) => {
      const currentPermissions = prev.permissions || [];

      // Check if permission already exists
      if (currentPermissions.some((p: any) => p.value === permission)) {
        return prev;
      }

      return {
        ...prev,
        permissions: [
          ...currentPermissions,
          { key: currentPermissions.length.toString(), value: permission },
        ],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { ...formData } as any;

      // Ensure permissions is an array of values before submitting
      if (payload.permissions && Array.isArray(payload.permissions)) {
        payload.permissions = payload.permissions.map(
          (setting: any) => setting.value
        );
      }

      if (mode === "edit") {
        const fieldsToRemove = [
          "passwordHash",
          "_id",
          "lastLogin",
          "createdAt",
          "updatedAt",
          "customPermissions",
          "__v",
        ];
        fieldsToRemove.forEach((field) => {
          if (field in payload) delete payload[field];
        });
      }

      const response =
        mode === "edit"
          ? await axiosInstance.put(`/user/${initialData._id}`, payload)
          : await axiosInstance.post("/user/add", payload);

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/admin/users");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.message?.message && Array.isArray(error.message.message)) {
        error.message.message.forEach((msg: string) => toast.error(msg));
      } else if (Array.isArray(error.message)) {
        error.message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(
          typeof error.message === "string"
            ? error.message
            : "An error occurred"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderSettings = (settings: any, prefix: string) => {
    const settingsArray = Array.isArray(settings) ? settings : [];

    return (
      <div className="space-y-3">
        {settingsArray.map(({ key, value }: { key: string; value: string }) => (
          <div key={`${prefix}_${key}`} className="flex items-center space-x-2">
            <Input
              id={`${prefix}_${key}`}
              type="text"
              value={value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [prefix]: prev
                    ? [prefix].map((item: any) =>
                        item.key === key
                          ? { ...item, value: e.target.value }
                          : item
                      )
                    : "",
                }))
              }
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => handleRemoveSetting(prefix, key)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <i
                aria-label="Delete user"
                className="cursor-pointer fa-duotone fa-trash-can text-red-500 hover:text-red-700 transition-colors duration-200 text-lg mb-3"
              />
            </button>
          </div>
        ))}
        <div className="mt-4 p-3 border border-dashed border-gray-300 rounded-md">
          <h4 className="text-sm font-medium mb-2">
            <TranslatedText textKey="user.form.addSetting" />
          </h4>
          <div className="flex items-end space-x-2">
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
              disabled={!newSetting.value || newSetting.target !== prefix}
              className="mb-4 px-4 py-2 bg-green-500 text-white dark:text-black rounded hover:bg-green-600 disabled:bg-gray-300"
            >
              <TranslatedText textKey="add" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPermissions = () => {
    const permissions = Array.isArray(formData.permissions)
      ? formData.permissions
      : [];

    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          {permissions.map(({ key, value }: { key: string; value: string }) => (
            <div
              key={`permissions_${key}`}
              className="flex items-center space-x-2"
            >
              <div className="flex-grow p-2 border rounded">
                {Object.entries(PERMISSIONS).find(
                  ([_, permValue]) => permValue === value
                )?.[0] || value}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSetting("permissions", key)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <i
                  aria-label="Remove permission"
                  className="cursor-pointer fa-duotone fa-trash-can text-red-500 hover:text-red-700 transition-colors duration-200 text-lg"
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 border border-dashed border-gray-300 rounded-md">
          <h4 className="text-sm font-medium mb-2">
            <TranslatedText textKey="user.form.addPermission" />
          </h4>
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <Select onValueChange={handleAddPermission}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  console.log(roles, "roles");
  return (
    <>
      <Spinner isLoading={isLoading} />
      <div className="flex justify-end gap-2 mb-4 ">
        <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
          submit
        </Button>
        <BackButton />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-6 bg-white dark:bg-[#171717] rounded-md text-gray-900 dark:text-gray-100 h-[88vh] overflow-auto"
      >
        <section aria-labelledby="user-heading">
          <h2 id="user-heading" className="text-xl font-bold mb-4">
            <TranslatedText textKey="tenant.userInfo" />
          </h2>
          <div className="border-b pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formFields.map((field: any) => (
              <FormInput
                key={field.id}
                field={field}
                value={formData[field.id as keyof typeof formData] as string}
                onChange={(id, value) =>
                  setFormData((prev) => ({ ...prev, [id]: value }))
                }
              />
            ))}

            {/* Permissions section with select dropdown */}
            <div className="col-span-full">
              <h3 className="text-lg font-semibold mt-4">
                <TranslatedText textKey="user.form.permissions" />
              </h3>
              {renderPermissions()}
            </div>
          </div>
        </section>
      </form>
    </>
  );
};

export default UserForm;
