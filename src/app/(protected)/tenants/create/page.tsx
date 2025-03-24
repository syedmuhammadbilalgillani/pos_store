import dynamic from "next/dynamic";

const TenantStoreUserForm = dynamic(() => import("../TenantStoreUserForm"), {
  loading: () => <p>Loading...</p>,
});
const Page = () => {
  return (
    <>
      <TenantStoreUserForm />
    </>
  );
};

export default Page;
