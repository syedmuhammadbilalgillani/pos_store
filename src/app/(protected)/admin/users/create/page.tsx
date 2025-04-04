import dynamic from "next/dynamic";

const UserForm = dynamic(() => import("../UserForm"), {
  loading: () => <p>Loading...</p>,
});
const Page = () => {
  return (
    <>
      <UserForm />
    </>
  );
};

export default Page;
