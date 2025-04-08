import axiosInstance from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Papa from "papaparse";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Spinner from "./Spinner";
import { Input } from "./ui/input";

export const users: UserDto[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    passwordHash: "SecurePass123",
    phone: "+1234567890",
    role: "admin",
    isActive: true,
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    passwordHash: "SecurePass456",
    phone: "+1234567891",
    role: "manager",
    isActive: true,
  },
  {
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    passwordHash: "SecurePass789",
    phone: "+1234567892",
    role: "manager",
    isActive: true,
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    passwordHash: "SecurePass321",
    phone: "+1234567893",
    role: "manager",
    isActive: true,
  },
  {
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie@example.com",
    passwordHash: "SecurePass654",
    phone: "+1234567894",
    role: "manager",
    isActive: true,
  },
  {
    firstName: "David",
    lastName: "Williams",
    email: "david@example.com",
    passwordHash: "SecurePass987",
    phone: "+1234567895",
    role: "staff",
    isActive: true,
  },
  {
    firstName: "Eva",
    lastName: "Davis",
    email: "eva@example.com",
    passwordHash: "SecurePass741",
    phone: "+1234567896",
    role: "staff",
    isActive: true,
  },
  {
    firstName: "Frank",
    lastName: "Miller",
    email: "frank@example.com",
    passwordHash: "SecurePass852",
    phone: "+1234567897",
    role: "staff",
    isActive: true,
  },
  {
    firstName: "Grace",
    lastName: "Wilson",
    email: "grace@example.com",
    passwordHash: "SecurePass963",
    phone: "+1234567898",
    role: "staff",
    isActive: true,
  },
  {
    firstName: "Henry",
    lastName: "Moore",
    email: "henry@example.com",
    passwordHash: "SecurePass147",
    phone: "+1234567899",
    role: "staff",
    isActive: true,
  },
];

interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: string;
  isActive?: boolean;
  lastLogin?: string;
  permissions?: Record<string, any>;
}

interface UserCsvUploaderProps {
  refetch: (params?: any) => void;
}

const UserCsvUploader: React.FC<UserCsvUploaderProps> = ({ refetch }) => {
  const [parsedUsers, setParsedUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const allUsers: UserDto[] = [];
    let filesProcessed = 0;

    Array.from(uploadedFiles).forEach((file) => {
      Papa.parse<UserDto>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data.map((user) => ({
            ...user,
            isActive: user.isActive === ("true" as boolean | string),
          }));

          allUsers.push(...parsedData);
          filesProcessed++;

          // Only set state after all files are parsed
          if (filesProcessed === uploadedFiles.length) {
            setParsedUsers(allUsers);
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error.message);
        },
      });
    });
  };

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/user/import", {
        users: parsedUsers,
      });

      console.log("Bulk upload success:", response.data);

      // Display a summary toast with success/skipped counts
      if (response?.data?.data?.successful > 0) {
        refetch();
        setIsLoading(false);
        setParsedUsers([]);
        toast.success(
          `Successfully added ${response.data.data.successful} of ${response.data.total} users`
        );
      }

      // Display error messages for skipped records
      if (response.data.data.skipped > 0) {
        setIsLoading(false);
        setParsedUsers([]);

        // Group users by reason to avoid too many toasts
        const errorGroups: { [key: string]: string[] } = {};

        response.data.data.errors.forEach(
          (error: {
            email: string;
            phone: string;
            error: string;
            reason: string;
          }) => {
            const errorKey = error.reason || error.error;
            if (!errorGroups[errorKey]) {
              errorGroups[errorKey] = [];
            }
            errorGroups[errorKey].push(error.email);
          }
        );

        // Display grouped error messages
        Object.entries(errorGroups).forEach(([errorMsg, emails]) => {
          const userList =
            emails.length > 3
              ? `${emails.slice(0, 3).join(", ")} and ${emails.length - 3} more`
              : emails.join(", ");

          toast.error(`${errorMsg}: ${userList}`);
        });
      }
    } catch (err: any) {
      //   console.error("Bulk upload failed:", err);
      setIsLoading(false);

      toast.error("Upload failed: " + (err.message || "Unknown error"));
    }
  };

  const generateCSV = () => {
    const csv = Papa.unparse(users); // <-- use the dummy data for download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "refrencedata.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // cleanup
  };

  return (
    <div className="pb-4 space-y-4 p-5 min-w-full">
      <Spinner isLoading={isLoading}></Spinner>
      <Button onClick={generateCSV} className="">
        Download Dummy CSV
      </Button>

      <div>
        <Input type="file" accept=".csv" multiple onChange={handleFileChange} />
      </div>

      {parsedUsers.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.passwordHash}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button onClick={handleUpload} className=" mt-4">
            Upload Data
          </Button>
        </>
      )}
    </div>
  );
};

export default UserCsvUploader;
