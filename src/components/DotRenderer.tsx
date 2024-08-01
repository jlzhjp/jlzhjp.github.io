import { instance } from "@viz-js/viz"
import { type ReactNode, useEffect, useRef } from "react"

type DotRendererProps = {
  engine: string
  children: ReactNode
}

export default function DotRenderer({
  children,
  engine = "dot",
}: DotRendererProps) {
  const graphContainerRef = useRef<HTMLDivElement | null>(null)
  const codeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    instance().then((viz) => {
      const svgElement = viz.renderSVGElement(codeRef.current!.textContent!, {
        engine: engine,
      })
      graphContainerRef.current!.replaceChildren(svgElement)
    })
  }, [])

  return (
    <div className="blog-border-pixel flex justify-center">
      <div className="overflow-auto [&>svg]:rounded" ref={graphContainerRef} />
      <div className="hidden" ref={codeRef}>
        {children}
      </div>
    </div>
  )
}
