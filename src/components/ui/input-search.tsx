import { SearchNormal } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import { Input } from "./input";

type InputSearchProps = React.ComponentProps<typeof Input> & {
  classNames?: Partial<Record<"root" | "input" | "icon", string>>;
};

export const InputSearch = ({
  classNames,
  className,
  ...props
}: InputSearchProps) => {
  return (
    <div
      className={cn(
        "relative ml-auto w-50 transition-[width] duration-300 ease-in-out focus-within:w-64",
        classNames?.root,
      )}
    >
      <Input
        type="search"
        className={cn(
          "rounded-full border-secondary pl-12",
          classNames?.input,
          className,
        )}
        {...props}
      />
      <SearchNormal
        className={cn(
          "-translate-y-1/2 absolute top-1/2 left-4 size-4",
          classNames?.icon,
        )}
      />
    </div>
  );
};
