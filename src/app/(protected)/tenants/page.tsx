import dynamic from "next/dynamic";

const Tenants = dynamic(() => import("./Tenants"), {
  loading: () => <p>Loading...</p>,
});
const Page = () => {
  return (
    <>
      <Tenants />
    </>
  );
};

export default Page;
