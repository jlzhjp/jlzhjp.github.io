import { cn } from "../utils"

type PixelLinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

const PixelLink = ({ href, className, children }: PixelLinkProps) => {
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
        "blog-font-pixel",
        className
      )}
      href={href}
    >
      {children}
    </a>
  )
}

export default PixelLink
