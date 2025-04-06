"use client";
import axiosInstance from "@/api";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import TranslatedText from "@/components/Language/TranslatedText";
import Spinner from "@/components/Spinner";
import { UserRole } from "@/constant/types";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
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
  role: UserRole.ADMIN,
  isActive: true,
  permissions: {},
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

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    }
  }, [initialData]);

  const formFields: any = [
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
    { id: "email", label: "user.form.email", type: "email", required: true },
    { id: "phone", label: "user.form.phone", type: "tel", required: true },
    {
      id: "role",
      label: "user.form.role",
      type: "select",
      options: Object.values(UserRole),
      required: true,
    },
    { id: "isActive", label: "user.form.isActive", type: "checkbox" },
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (id === "phone") {
      let formattedPhone = value.replace(/[^\d+]/g, "");
      if (formattedPhone && !formattedPhone.startsWith("+")) {
        formattedPhone = "+" + formattedPhone;
      }
      setFormData((prev) => ({ ...prev, [id]: formattedPhone }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === "checkbox" ? checked : value,
      }));
    }
  };
  const handleAddSetting = () => {
    if (!newSetting.key || !newSetting.value || !newSetting.target) return;

    setFormData((prev: any) => ({
      ...prev,
      [newSetting.target]: {
        ...(prev[newSetting.target as keyof any] as Record<string, any>),
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
    setFormData((prev: any) => {
      const currentSettings = {
        ...(prev[prefix as keyof any] as Record<string, any>),
      };
      delete currentSettings[key];
      return { ...prev, [prefix]: currentSettings };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { ...formData } as Record<string, any>;

      if (mode === "edit") {
        // Remove unwanted properties
        const fieldsToRemove = [
          "passwordHash",
          "isActive",
          "_id",
          "lastLogin",
          "createdAt",
          "updatedAt",
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
                    ...(prev[prefix as keyof typeof prev] || {}),
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
            <TranslatedText textKey="user.form.addSetting" />
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
    <>
      <Spinner isLoading={isLoading}></Spinner>
      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-6 bg-white dark:bg-[#171717] rounded-md text-gray-900 dark:text-gray-100 h-[88vh] overflow-auto"
      >
        <div className="flex justify-end sticky gap-2 top-0 right-0">
          <Button type="submit"  disabled={isLoading}>
            submit
          </Button>
          <BackButton />
        </div>

        <section aria-labelledby="user-heading">
          <h2 id="user-heading" className="text-xl font-bold mb-4">
            <TranslatedText textKey="tenant.userInfo" />
          </h2>
          <div className="border-b pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formFields
              .filter((field: any) => field.id !== "permissions")
              .map((field: any) =>
                field.type === "select" ? (
                  <div key={field.id} className="mb-4">
                    <label
                      htmlFor={field.id}
                      className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <TranslatedText textKey={field.label} />
                      {field.required && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>
                    <select
                      id={field.id}
                      value={
                        formData[field.id as keyof typeof formData] as string
                      }
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    >
                      {field.options?.map((option: any) => (
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
                        : (formData[
                            field.id as keyof typeof formData
                          ] as string) || ""
                    }
                    checked={
                      field.type === "checkbox"
                        ? (formData[
                            field.id as keyof typeof formData
                          ] as boolean)
                        : undefined
                    }
                    onChange={handleChange}
                    required={field.required}
                    placeholder={
                      field.id === "phone" ? "+11234567890" : undefined
                    }
                  />
                )
              )}
            <div className="col-span-full">
              <h3 className="text-lg font-semibold mt-4">
                <TranslatedText textKey="user.form.permissions" />
              </h3>
              {renderSettings(formData.permissions, "permissions")}
            </div>
          </div>
        </section>
      </form>
    </>
  );
};

export default UserForm;
