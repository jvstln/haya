"use client";
import { Shapes } from "iconsax-reactjs";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { Activity, useState } from "react";
import { Button } from "@/components/ui/button";

export const NewsBanner = ({
  show: controlledShow,
  onShowChange,
}: {
  show?: boolean;
  onShowChange?: (show: boolean) => void;
}) => {
  const [_show, _setShow] = useState(true);

  const show = controlledShow ?? _show;
  const setShow = (show: boolean) => {
    _setShow(show);
    onShowChange?.(show);
  };

  return (
    <Activity mode={show ? "visible" : "hidden"}>
      <div className="flex flex-col gap-4 space-y-2 bg-linear-to-b from-primary/40 p-6 text-sm text-white">
        Let&apos;s get straight to work
        <div className="flex items-center gap-2 bg-[#4C6FFF4D] px-12 py-3.5 text-xs">
          <Shapes className="ml-auto size-4" />
          You can create a sub-portfolio account under your profile
          <Link
            href="/dashboard/profile"
            className="font-medium text-sm underline"
          >
            Upgrade to pro
          </Link>
          <Button
            variant="ghost"
            className="ml-auto"
            onClick={() => setShow(false)}
          >
            <XIcon />
          </Button>
        </div>
      </div>
    </Activity>
  );
};
