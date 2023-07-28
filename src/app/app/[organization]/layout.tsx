"use client";

import { useEffect } from "react";
import { useAppHeader } from "../app-header";

export default function OrganizationLayout({
  children,
  params: { organization },
}: {
  children: React.ReactNode;
  params: {
    organization: string;
  };
}) {
  const { setOrganization } = useAppHeader();

  useEffect(() => {
    setOrganization(organization);
    return () => {
      setOrganization(null);
    };
  }, [organization, setOrganization]);

  return <>{children}</>;
}
