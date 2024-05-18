import { cn } from "../utils"

type HeaderLinkProps = {
  href: string
  children: React.ReactNode
}

const HeaderLink = ({ href, children }: HeaderLinkProps) => {
  return (
    <a
      className={cn(
        "before:content-['[']",
        "after:content-[']']",
        "before:opacity-0",
        "after:opacity-0",
        "before:transition-opacity",
        "after:transition-opacity",
        "hover:before:opacity-100",
        "hover:after:opacity-100",
        "cursor-pointer",
        "text-black",
        "hover:text-black"
      )}
    >
      {children}
    </a>
  )
}

export default function Header() {
  return (
    <header className="flex px-4 py-2 items-center border-b-2 border-b-black">
      <h1 className="m-0 text-lg text-mono">Home</h1>
      <div className="flex-grow"></div>
      <ul className="flex gap-2">
        <li className="text-mono">
          <HeaderLink href="#">Blog</HeaderLink>
        </li>
        <li className="text-mono">
          <HeaderLink href="#">About</HeaderLink>
        </li>
      </ul>
    </header>
  )
}
