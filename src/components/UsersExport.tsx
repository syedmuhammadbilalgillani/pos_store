"use client";

import axiosInstance from "@/api";
import { Loader2 } from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import Spinner from "./Spinner";
import { toast } from "sonner";

const UserExport = () => {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("csv");

  const handleExport = async () => {
    try {
      setLoading(true);
      const apiUrl = `/user/export`;
      const response = await axiosInstance.get(apiUrl);
      const userData = response.data;

      if (format === "csv") {
        const csv = Papa.unparse(userData, {
          header: true,
          quotes: true,
          skipEmptyLines: true,
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `users-export-${new Date().toISOString()}.csv`
        );
        link.setAttribute("aria-label", "Download CSV file");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(userData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `users-export-${new Date().toISOString()}.json`
        );
        link.setAttribute("aria-label", "Download JSON file");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      if (response.status === 200) {
        toast.success("Export successful!");
      }
    } catch (err) {
      toast.error(`Export failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Export Users Button">Export Users</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[400px] px-6 py-4 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Export Users Data
          </DialogTitle>
        </DialogHeader>

        <Spinner isLoading={loading} />

        <div className="space-y-4">
          <div>
            <Label htmlFor="format">Select Export Format</Label>
            <Select value={format} onValueChange={setFormat} disabled={loading}>
              <SelectTrigger id="format" aria-label="Export Format">
                <SelectValue placeholder="Choose format">
                  {format.toUpperCase()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleExport}
            disabled={loading}
            variant="secondary"
            type="button"
            className="w-full sm:w-auto"
            aria-label="Download users data"
          >
            <i className="fa-duotone fa-file-export mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserExport;
