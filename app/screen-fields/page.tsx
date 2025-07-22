"use client";
import React from "react";
import ScreenFieldsManagement from "@/components/screen-fields-management";

export default function ScreenFieldsPage() {
  return <ScreenFieldsManagement onBack={() => window.history.back()} />;
} 