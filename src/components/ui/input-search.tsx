import { SearchNormal } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import type { Input } from "./input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

type InputSearchProps = React.ComponentProps<typeof Input> & {
  classNames?: Partial<Record<"root" | "input" | "icon", string>>;
};

export const InputSearch = ({
  classNames,
  className,
  ...props
}: InputSearchProps) => {
  return (
    <InputGroup
      className={cn(
        "w-50 rounded-full transition-[width] duration-300 ease-in-out focus-within:not-[class*=w-full]:w-64",
        classNames?.root,
        className,
      )}
    >
      <InputGroupInput
        type="search"
        className={cn(classNames?.input)}
        {...props}
      />
      <InputGroupAddon>
        <SearchNormal className={cn(classNames?.icon)} />
      </InputGroupAddon>
    </InputGroup>
  );
};
