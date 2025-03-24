"use client"

import { useParams } from "next/navigation";

const TenantById = () => {
    const { tenantId } = useParams();

  return (
    <div>{tenantId}</div>
  )
}

export default TenantById