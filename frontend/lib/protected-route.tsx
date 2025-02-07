import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useAuthRedirect() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth"); 
    } else {
      setLoading(false);
    }
  }, [router]);

  return loading;
}
