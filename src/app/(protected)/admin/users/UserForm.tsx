"use client";
import axiosInstance from "@/api";
import { fetchRoles } from "@/api/apiFuntions";
import BackButton from "@/components/BackButton";
import { FormInput } from "@/components/FormInput";
import TranslatedText from "@/components/Language/TranslatedText";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { PERMISSIONS } from "@/constant/permissions";
import { UserRole } from "@/constant/types";
import { usePermission } from "@/hooks/usePermission";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [isRolesLoading, setIsRolesLoading] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([]);

  const setPermissions = useUserStore((state) => state.setPermissions);

  const { hasPermission } = usePermission();

  const shouldFetchUsers = hasPermission(PERMISSIONS.CREATE_USER);

  // For storing the list of selected permission values (strings)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Fetch roles
  useEffect(() => {
    const fetchRolesData = async () => {
      setIsRolesLoading(true);
      try {
        const response = await fetchRoles();
        setRoles(response); // Assuming response.data is an array of roles
      } catch (error: unknown) {
        toast.error(`Failed to fetch roles. ${error}`);
      } finally {
        setIsRolesLoading(false);
      }
    };

    if (shouldFetchUsers) {
      fetchRolesData();
    }
  }, [shouldFetchUsers]);

  // Convert PERMISSIONS object to array of options for the select component
  const permissionOptions = Object.entries(PERMISSIONS).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  useEffect(() => {
    if (initialData) {
      console.log(initialData, "initial data");
      const role = initialData.role || initialData.role || "";
      setFormData({ ...defaultFormData, ...initialData, role });

      // Initialize permissions if editing
      if (mode === "edit" && initialData.permissions) {
        // Handle both array and object formats for permissions
        let formattedPermissions = [];
        const permissionValues: string[] = [];

        if (Array.isArray(initialData.permissions)) {
          formattedPermissions = initialData.permissions.map(
            (permission: any, index: any) => {
              const permValue =
                permission.name || permission.value || permission;
              permissionValues.push(permValue);
              return {
                key: permission._id || permission.id || index.toString(),
                value: permValue,
              };
            }
          );
        }

        setFormData((prev) => ({
          ...prev,
          permissions: formattedPermissions,
        }));

        setSelectedPermissions(permissionValues);
      }
    }
  }, [initialData, mode]);

  const userFormFields: any[] = [
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

  // New handler for the MultiSelect
  const handlePermissionsChange = (values: string[]) => {
    setSelectedPermissions(values);

    // Convert to the same format as the original permissions array
    const formattedPermissions = values?.map((value, index) => ({
      key: index.toString(),
      value,
    })) as any;

    setFormData((prev) => ({
      ...prev,
      permissions: formattedPermissions,
    }));
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
        if (mode === "edit") {
          setPermissions(response?.data?.data?.permissions);
        }
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

  const renderPermissions = () => {
    const permissions = Array.isArray(formData.permissions)
      ? formData.permissions
      : [];

    // Filter out permissions already available in user permissions in edit mode
    // const availablePermissions = permissionOptions.filter(
    //   (option) =>
    //     !permissions.some((p: any) => p.value === option.value)
    // );

    return (
      <div className="space-y-4">
        <MultiSelect
          options={permissionOptions}
          onValueChange={handlePermissionsChange}
          defaultValue={selectedPermissions}
          placeholder="Select permissions"
          className="w-fit"
        />
        <div className="grid lg:pgrid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4">
          {permissions.map(({ key, value }: { key: string; value: string }) => (
            <div
              key={`permissions_${key}`}
              className="flex items-center space-x-2"
            >
              <div className="flex-grow p-2 border rounded">
                {Object.entries(PERMISSIONS).find(
                  ([permValue]) => permValue === value
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
      </div>
    );
  };

  return (
    <>
      <Spinner isLoading={isLoading || isRolesLoading} />

      <div className="flex justify-end gap-2 mb-4">
        <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
          submit
        </Button>
        <BackButton />
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-6  parent"
      >
        <section aria-labelledby="user-heading">
          <h2 id="user-heading" className="text-xl font-bold mb-4">
            <TranslatedText textKey="tenant.userInfo" />
          </h2>
          <div className="border-b pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userFormFields.map((field: any) => (
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
            {mode === "edit" && (
              <div className="col-span-full">
                <h3 className="text-lg font-semibold mt-4">
                  <TranslatedText textKey="user.form.permissions" />
                </h3>
                {renderPermissions()}
              </div>
            )}
          </div>
        </section>
      </form>
    </>
  );
};

export default UserForm;
