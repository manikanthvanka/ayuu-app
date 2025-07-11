"use client"

import { DateInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import React from 'react';

export function DatePicker({ value, onChange, label }: {
  value: string | null;
  onChange: (date: string | null) => void;
  label?: string;
}) {
  return (
    <DateInput
      value={value}
      onChange={onChange}
      label={label}
      placeholder="Pick a date"
      inputWrapperOrder={["label", "input", "description", "error"]}
      radius="md"
    />
  );
} 