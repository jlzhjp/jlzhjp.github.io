import { useState, useRef, useEffect, type ReactNode } from "react"
import BiwaScheme from "biwascheme"
import classes from "./SchemeRunner.module.css"

const { TopEnv } = BiwaScheme

const shim = `
  (define nil '())
  (define true #t)
  (define false #f)
  (define (random n)
    (random-integer n))

  ; https://github.com/biwascheme/biwascheme/issues/110#issuecomment-335869546
  (define (date2runtime date)
    ; HACK
    ; wraps around occasionally!
    (+
       (* (date-hour date) 60 60 1000)
       (* (date-minute date) 60 1000)
       (* (date-second date) 1000)
       (date-millisecond date)
    )
  )

  (define (runtime) (date2runtime (current-date)))
`

type SchemeEvalutionResultProps = {
  code: string
}

function SchemeEvaluationResult({ code }: SchemeEvalutionResultProps) {
  const [codeOutput, setCodeOutput] = useState<string>("")

  const appendOutput = (old: string, newValue: string) => {
    if (old === "") return newValue
    return old + "<br>" + newValue
  }

  useEffect(() => {
    for (const prop in TopEnv) {
      delete TopEnv[prop]
    }

    BiwaScheme.define_libfunc("display", 1, 1, (args: any) => {
      setCodeOutput(
        (x) =>
          x + `<span style="font-style: italic">${args[0].toString()}</span>`,
      )
    })

    BiwaScheme.define_libfunc("newline", 0, 0, () => {
      setCodeOutput((x) => x + "<br>")
    })

    const interpreter = new BiwaScheme.Interpreter((err: any) => {
      setCodeOutput((x) =>
        appendOutput(
          x,
          `<span style="color: var(--red)">${err.toString()}</span>`,
        ),
      )
    })

    interpreter.evaluate(shim)

    interpreter.evaluate(code, (result: any) => {
      if (result) {
        setCodeOutput((x) =>
          appendOutput(
            x,
            `<span style="color: var(--green)">${result.toString()}</span>`,
          ),
        )
      }
    })
  }, [])

  return (
    <pre
      className="blog-font-mono leading-none"
      dangerouslySetInnerHTML={{ __html: codeOutput }}
    />
  )
}

type SchemeRunnerProps = {
  children: ReactNode
}

export default function SchemeRunner({ children }: SchemeRunnerProps) {
  const codeElementRef = useRef<HTMLDivElement | null>(null)
  const [codeToExecute, setCodeToExecute] = useState<string | undefined>()

  const handleRunButtonClick = () => {
    setCodeToExecute(codeElementRef.current!.textContent!)
  }

  return (
    <div className="flex flex-col">
      <div className="blog-border-pixel relative overflow-x-auto overflow-y-hidden leading-none">
        <div className={classes.astroCodeContainer} ref={codeElementRef}>
          {children}
        </div>
        <button
          className="px-1 blog-border-pixel absolute right-0 top-0 active:scale-90"
          onClick={handleRunButtonClick}
        >
          Run
        </button>
      </div>
      {codeToExecute && (
        <div className="blog-border-pixel pt-1 px-2 mt-[-4px] !border-t-0 overflow-x-auto">
          <SchemeEvaluationResult code={codeToExecute} />
        </div>
      )}
    </div>
  )
}
