'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            open,
            onOpenChange,
          });
        }
        return child;
      })}
    </div>
  );
}

export function PopoverTrigger({ asChild, children, ...props }: PopoverTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    // onOpenChange özelliğini doğrudan button'a geçirmek yerine, 
    // sadece onClick olayını geçirelim
    const childProps = { ...props };
    delete childProps.onOpenChange; // Bu özelliği kaldır
    
    return React.cloneElement(children, { ...childProps });
  }
  
  return <div {...props}>{children}</div>;
}

export function PopoverContent({ children, className = '' }: PopoverContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        const popover = ref.current.closest('.relative');
        if (popover) {
          const openState = popover.getAttribute('data-state') === 'open';
          if (openState) {
            const onOpenChange = (popover as any).__onOpenChange;
            if (typeof onOpenChange === 'function') {
              onOpenChange(false);
            }
          }
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div 
      ref={ref}
      className={`absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}