import { Input } from "@nextui-org/react"
import React from "react"
import { FaSearch } from "react-icons/fa"

type Props = {
  value: string
  onChange: (value: string) => void
}

const SearchInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Input
      onChange={e => onChange(e.target.value)}
      value={value}
      label="Search"
      isClearable
      onClear={() => onChange("")}
      radius="lg"
      classNames={{
        label: "text-black/50 dark:text-white/90",
        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "shadow-xl",
          "bg-default-100",
          "dark:bg-default-100",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focus=true]:bg-default-200/50",
          "dark:group-data-[focus=true]:bg-default/60",
          "!cursor-text",
        ],
      }}
      placeholder="Type to search..."
      startContent={
        <FaSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
      }
    />
  )
}

export default SearchInput