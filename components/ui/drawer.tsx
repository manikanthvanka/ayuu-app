"use client"

import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

export function Drawer({ open, onOpenChange, children, title }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed top-0 right-0 h-full w-[350px] max-w-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full"
          style={{ outline: 'none' }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="text-gray-500 hover:text-black">&times;</button>
            </Dialog.Close>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
