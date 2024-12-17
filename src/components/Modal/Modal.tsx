'use client';

import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel /*DialogTitle*/ } from '@headlessui/react';
//import { CheckIcon } from '@heroicons/react/24/outline'

type ModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Modal({ open, setOpen, children }: React.PropsWithChildren<ModalProps>) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-600/75 dark:bg-slate-900/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-clear-700 dark:bg-clear-200 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <section className="flex flex-col gap-2">{children}</section>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
