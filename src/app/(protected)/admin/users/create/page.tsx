import Spinner from "@/components/Spinner";
import dynamic from "next/dynamic";

const UserForm = dynamic(() => import("../UserForm"), {
  loading: () => <Spinner isLoading={true}/>,
});
const Page = () => {
  return (
    <>
      <UserForm />
    </>
  );
};

export default Page;
