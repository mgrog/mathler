import { PropsWithChildren, useState } from 'react';

import { Cross2Icon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';

interface MessageProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Message({
  children,
  open,
  ...props
}: PropsWithChildren<MessageProps>) {
  // Prevent message close while user is hovering over it
  const [isHovered, setIsHovered] = useState(false);
  const [innerOpen, setInnerOpen] = useState(open);

  if (open !== innerOpen) {
    if (open) {
      setInnerOpen(true);
    }
    if (!open && !isHovered) {
      setInnerOpen(false);
    }
  }

  return (
    <Popover.Root open={innerOpen} {...props}>
      {/* Place message in relative position */}
      <Popover.Anchor>{<div />}</Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          className="flex w-[350px] flex-col rounded border-2 border-red-700 bg-red-200 text-red-700 font-medium p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity]]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {children}
          <Popover.Close
            className="absolute text-red-600 right-[8px] top-[8px] inline-flex size-[18px] cursor-default items-center justify-center rounded-full outline-none hover:bg-red-300 transition-colors duration-200 ease-in-out"
            aria-label="Close"
            onClick={() => {
              props.onOpenChange?.(false);
              setInnerOpen(false);
            }}
          >
            <Cross2Icon />
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
