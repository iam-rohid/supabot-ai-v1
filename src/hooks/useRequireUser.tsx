import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export const useRequireUser = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // if(!data) {
  //   const params = new URLSearchParams({next: pathname})
  //   router.push(`/signin?${params.toString()}`)
  // }
  // return data?.user;
  console.log(data);
};
