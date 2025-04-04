"use client";
// import Image from "next/image";
// import { TeamsList } from "./TeamList";
import { NavigationItem, Team } from "./types";
// import { Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";

import { fetchStoreData, Logout, updateStoreData } from "@/api/apiFuntions";
import { Tenant, TenantFormData, User, UserRole } from "@/constant/types";
import { useRoleBasedNavigation } from "@/hooks/useRoleBasedNavigation";
import { useTenantStore } from "@/stores/tenantStore";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import { toast } from "../Toast/toast_manager";
import { Navigation } from "./Navigation";
// import { signOut } from "next-auth/react";
interface SidebarProps {
  teams: Team[];
}

// export const Sidebar: React.FC<SidebarProps> = ({ navigation, teams }) => (
export const Sidebar: React.FC<SidebarProps> = React.memo(({ teams }) => {
  const router = useRouter();
  const tenant = useTenantStore((state) => state.tenant) as Tenant | null;
  const user = useUserStore((state) => state.user) as User | null;
  const clearTenant = useTenantStore((state) => state.clearTenant);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isStoreDetailDialogueOpen, setIsStoreDetailDialogueOpen] =
    useState(false);

  // Use the role-based navigation hook instead of props
  const navigation = useRoleBasedNavigation();

  // Use useCallback to memoize the logout handler
  const handleLogout = useCallback(async () => {
    try {
      const res = await Logout();
      toast.success(res.message);
      Cookies.remove("accessToken");
      clearUser();
      clearTenant();
      router.push("/");
      localStorage.clear();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Error during logout");
      console.error("Error during logout:", errorMessage);
    }
  }, [router, clearUser, clearTenant]);

  // Use useMemo for the company logo to avoid re-renders
  const companyLogo = useMemo(
    () => (
      <Image
        alt={`${tenant?.name || "Company"} Logo`}
        src={tenant?.logoUrl?.trim() || "/placeholder.jpg"}
        width={64}
        height={64}
        className="h-16 w-16 object-cover rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-all duration-200"
        priority
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = "/placeholder.jpg";
        }}
        loading="eager"
      />
    ),
    [tenant?.logoUrl, tenant?.name]
  );

  return (
    <div
      className={`flex  grow flex-col gap-y-5  overflow-y-auto rounded-lg bg-[#FFFFFF] dark:bg-[#15181E] dark:text-[#ECDFCC] text-[#21242E]  px-6 pb-4`}
    >
      <div className="flex flex-col items-center justify-center py-4 px-2 rounded-lg transition-colors duration-200 cursor-pointer group">
        <div className="relative mb-2">
          {companyLogo}
          {user?.role === "admin" && (
            <div
              onClick={() => setIsStoreDetailDialogueOpen(true)}
              className="absolute -bottom-1 -right-1 bg-gray-100 dark:bg-gray-700 p-0.5 px-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 group-amber-500 dark:group-amber-500 transition-colors duration-200"
            >
              <i className="fa-duotone fa-solid fa-pen text-xs rounded-full"></i>{" "}
            </div>
          )}
        </div>

        <div className="hidden group-hover:block absolute bg-gray-800 text-white text-xs px-2 py-1 rounded-md -top-8 whitespace-nowrap">
          Edit store details
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 ">
          <li>
            <Navigation items={navigation as any} />
          </li>
          {/* <li>
          <TeamsList teams={teams} />
        </li> */}
          <li className="mt-auto">
            <div
              // onClick={() =>
              //   signOut({
              //     callbackUrl: "/",
              //     redirect: true,
              //   })
              // }
              onClick={handleLogout}
              className="group -mx-2 flex gap-x-3 rounded-md p-2   text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#21242E] hover:text-black dark:hover:text-white cursor-pointer"
            >
              {/* <PowerIcon
              aria-hidden="true"
              className="size-6 shrink-0 text-textColor group-hover:text-textColor"
            />  */}
              Logout
            </div>
          </li>
        </ul>
      </nav>
      <Modal
        isOpen={isStoreDetailDialogueOpen}
        onClose={() => setIsStoreDetailDialogueOpen(false)}
      >
        <TenantDetailsForm
          setIsStoreDetailDialogueOpen={setIsStoreDetailDialogueOpen}
        />
      </Modal>
    </div>
  );
});

// To this:
interface TenantDetailsFormProps {
  setIsStoreDetailDialogueOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TenantDetailsForm: React.FC<TenantDetailsFormProps> = React.memo(
  ({ setIsStoreDetailDialogueOpen }) => {
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
            toast.success("Store details updated successfully");
            const data = await fetchStoreData();
            setTenant(data[0]);
            setIsStoreDetailDialogueOpen(false);
          }
        } catch (error) {
          toast.error("Failed to update store details");
          console.error("Error updating store:", error);
        }
      },
      [formData, logoFile, tenant?._id, setTenant, setIsStoreDetailDialogueOpen]
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
    );
  }
);
