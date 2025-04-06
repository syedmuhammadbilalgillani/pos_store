"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/api";
import UserForm from "../UserForm";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

const EditUserPage = () => {
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/user/${params.id}`);
        console.log(response, "res");
        if (response.status === 200) {
          setUserData(response?.data?.data??{});
        } else {
          toast.error(response.data.message || "Failed to fetch user data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  if (isLoading) return <Spinner isLoading={true} />;

  return <UserForm initialData={userData} mode="edit" />;
};

export default EditUserPage;
