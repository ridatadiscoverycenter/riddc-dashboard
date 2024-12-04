'use client';
import React from 'react';
import { Button } from '../Button';
import Modal from './Modal';

type ButtonModalProps = {
  label: string;
  title: string;
  buttonStyles?: string;
  modalStyles?: string;
};

export function ButtonModal({
  label,
  title,
  buttonStyles = '',
  modalStyles = '',
  children,
}: React.PropsWithChildren<ButtonModalProps>) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button className={buttonStyles} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal open={open} setOpen={setOpen} title={title} modalStyles={modalStyles}>
        {children}
      </Modal>
    </>
  );
}
