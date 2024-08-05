import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AuthWrapper = (WrappedComponent: React.ComponentType) => {
  return async function AuthWrapper(props: any) {
    const token = cookies().get("token");

    if (!token) {
      redirect("/signup");
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthWrapper;
