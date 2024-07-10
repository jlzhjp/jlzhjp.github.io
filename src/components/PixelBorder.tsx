import { cn } from "../utils"
import classes from "./PixelBorder.module.css"

type PixelBorderProps = {
  tag: keyof JSX.IntrinsicElements
  children: React.ReactNode
  className?: string
}

const PixelBorder: React.FC<PixelBorderProps> = ({
  tag = "div",
  className,
  children,
}: PixelBorderProps & React.HTMLAttributes<HTMLElement>) => {
  const Wrapper = tag
  return (
    <Wrapper className={cn(classes.pixelBorder, className)}>{children}</Wrapper>
  )
}

export default PixelBorder
