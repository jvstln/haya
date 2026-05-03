import { SearchNormal } from "iconsax-reactjs"
import { Input } from "./input.js"
import { cn } from "../lib/utils.js"

type InputSearchProps = React.ComponentProps<typeof Input> & {
  classNames?: Partial<Record<"root" | "input" | "icon", string>>
}

export const InputSearch = ({
  classNames,
  className,
  ...props
}: InputSearchProps) => {
  return (
    <div
      className={cn(
        "relative ml-auto w-50 transition-[width] duration-300 ease-in-out focus-within:w-64",
        classNames?.root
      )}
    >
      <Input
        type="search"
        className={cn(
          "rounded-full border-secondary pl-12",
          classNames?.input,
          className
        )}
        {...props}
      />
      <SearchNormal
        className={cn(
          "absolute top-1/2 left-4 size-4 -translate-y-1/2",
          classNames?.icon
        )}
      />
    </div>
  )
}
