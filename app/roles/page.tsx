"use client";

import React from "react";
import RoleManagement from "@/components/role-management";

export default function RoleManagementPage() {
  // TODO: Replace with real user role and user roles from context or API
  const userRole = "admin";
  const userRoles:any = [];

  return (
    <RoleManagement
      onBack={() => window.history.back()}
      userRole={userRole}
      userRoles={userRoles}
    />
  );
} 