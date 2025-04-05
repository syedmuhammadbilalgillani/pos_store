"use client";
import { fetchStoreData } from "@/api/apiFuntions";
import DataTable from "@/components/DataTable";
// import { TenantColumn } from "@/constant/columns";
import { Tenant } from "@/constant/types";
import { useFetchData } from "@/hooks/useFetchData";
import { useRouter } from "next/navigation";

const Tenants = () => {
  const { data, loading } = useFetchData(fetchStoreData);
  const router = useRouter();
  const actions = (item: Tenant) => (
    <div
      className="space-x-2 "
      onClick={() => router.push(`/tenants/${item?._id ?? 1}`)}
    >
      <i className="fa fa-detail">d</i>
    </div>
  );
  return (
    <>
      <div className="max-w-dvw bg-white dark:bg-[#15181E]  p-5">
        {/* <button onClick={() => refetch()}>refech</button> */}
        <DataTable
          columns={[]}
          data={data ?? []}
          loading={loading} // Date filter configuration
          enableDateFilter={true}
          dateKey="createdAt"
          dateFilterLabel="Filter by order date"
          pageSize={10}
          actions={actions}
        />
      </div>
    </>
  );
};

export default Tenants;
