import { codeToHtml } from "shiki"
import { useState, useEffect, useMemo } from "react"
import BiwaScheme from "biwascheme"

const { TopEnv } = BiwaScheme

type SchemeCodeProps = {
  code: string
}

BiwaScheme.define_libfunc("random", 1, 1, (args: any) => {
  return Math.floor(Math.random() * args[0])
})

const SchemeCode = ({ code }: SchemeCodeProps) => {
  const [codeHtml, setCodeHtml] = useState("")
  const [status, setStatus] = useState("pending")
  const [codeOutput, setCodeOutput] = useState<string | undefined>(undefined)

  const biwa = useMemo(
    () =>
      new BiwaScheme.Interpreter((err: any) => {
        setCodeOutput(
          `<span style="color: var(--red)">${err.toString()}</span>`,
        )
      }),
    [],
  )

  useEffect(() => {
    codeToHtml(code.trim(), {
      lang: "scheme",
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    })
      .then((html) => {
        setCodeHtml(html)
        setStatus("done")
      })
      .catch((error) => {
        console.error(error)
        setStatus("error")
      })
  }, [code])

  const handleRunButtonClick = () => {
    for (const prop in TopEnv) {
      delete TopEnv[prop]
    }

    setCodeOutput("")

    BiwaScheme.define_libfunc("display", 1, 1, (args: any) => {
      setCodeOutput(
        (prev) =>
          prev +
          `<span style="font-style: italic">${args[0].toString()}</span>`,
      )
    })

    BiwaScheme.define_libfunc("newline", 0, 0, () => {
      setCodeOutput((prev) => prev + "<br>")
    })

    biwa.evaluate(code, (result: any) => {
      if (result) {
        setCodeOutput(
          (prev) =>
            (prev ? prev + "<br>" : "") +
            `<span style="color: var(--green)">${result.toString()}</span>`,
        )
      }
    })
  }

  const codeElement =
    status === "done" ? (
      <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
    ) : (
      <pre>
        <code>{code.trim()}</code>
      </pre>
    )

  return (
    <div className="flex flex-col">
      <div className="blog-border-pixel py-1 px-2 relative overflow-x-auto overflow-y-hidden leading-none">
        {codeElement}
        <button
          className="px-1 blog-border-pixel absolute right-0 top-0 active:scale-90"
          onClick={handleRunButtonClick}
        >
          Run
        </button>
      </div>
      {codeOutput && (
        <div className="blog-border-pixel pt-1 px-2 mt-[-4px] !border-t-0 overflow-x-auto">
          <pre
            className="blog-font-mono leading-none"
            dangerouslySetInnerHTML={{ __html: codeOutput }}
          ></pre>
        </div>
      )}
    </div>
  )
}

export default SchemeCode
