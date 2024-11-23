import { useState, useRef, useEffect, type ReactNode } from "react"
import BiwaScheme from "biwascheme"
import classes from "./SchemeRunner.module.css"

type SchemePainterResultProps = {
  code: string
  size: number
}

function SchemePainterResult({ code, size }: SchemePainterResultProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    const context = canvasRef.current!.getContext("2d")!
    const error = evaluateSchemePainterCode(code, context)
    setErrorMessage(error)
  }, [])

  return errorMessage ? (
    <span style={{ color: "var(--red)" }}>{errorMessage}</span>
  ) : (
    <div className="flex justify-center">
      <canvas
        style={{
          imageRendering: "initial",
          width: `${size}px`,
          height: `${size}px`,
        }}
        width={size * window.devicePixelRatio}
        height={size * window.devicePixelRatio}
        ref={canvasRef}
      />
    </div>
  )
}

type SchemeEvalutionResultProps = {
  code: string
}

function SchemeEvaluationResult({ code }: SchemeEvalutionResultProps) {
  const [codeOutput, setCodeOutput] = useState<string>("")

  useEffect(() => {
    setCodeOutput(evaluateSchemeCode(code))
  }, [])

  return (
    <pre
      className="font-pixel-mono leading-none"
      dangerouslySetInnerHTML={{ __html: codeOutput }}
    />
  )
}

type SchemeRunnerProps = {
  output: "painter" | "plain"
  children: ReactNode
}

export default function SchemeRunner({
  output = "plain",
  children,
}: SchemeRunnerProps) {
  const codeElementRef = useRef<HTMLDivElement | null>(null)
  const [codeToExecute, setCodeToExecute] = useState<string | undefined>()

  const handleRunButtonClick = () => {
    setCodeToExecute(codeElementRef.current!.textContent!)
  }

  const EvaluationResult: ({ code }: { code: string }) => ReactNode =
    output === "plain"
      ? ({ code }) => <SchemeEvaluationResult code={code} />
      : ({ code }) => <SchemePainterResult code={code} size={300} />

  return (
    <div className="flex flex-col">
      <div className="border-pixel relative overflow-x-auto overflow-y-hidden leading-none">
        <div className={classes.astroCodeContainer} ref={codeElementRef}>
          {children}
        </div>
        <button
          className="px-1 border-pixel absolute right-0 top-0 active:scale-90"
          onClick={handleRunButtonClick}
        >
          Run
        </button>
      </div>
      {codeToExecute && (
        <div className="border-pixel pt-1 px-2 mt-[-4px] !border-t-0 overflow-x-auto">
          <EvaluationResult code={codeToExecute} />
        </div>
      )}
    </div>
  )
}

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

function initializeSchemeEnvironmenet() {
  for (const prop in TopEnv) {
    delete TopEnv[prop]
  }
}

function evaluateSchemePainterCode(
  code: string,
  context: CanvasRenderingContext2D
) {
  initializeSchemeEnvironmenet()

  const fullCode = `
(define (make-frame origin edge1 edge2) (list origin edge1 edge2))
(define origin-frame car)
(define edge1-frame cadr)
(define edge2-frame caddr)

(define (make-vect x y) (cons x y))
(define xcor-vect car)
(define ycor-vect cdr)

(define (add-vect v1 v2)
  (make-vect (+ (xcor-vect v1) (xcor-vect v2))
             (+ (ycor-vect v1) (ycor-vect v2))))

(define (sub-vect v1 v2)
  (make-vect (- (xcor-vect v1) (xcor-vect v2))
             (- (ycor-vect v1) (ycor-vect v2))))

(define (scale-vect s v)
  (make-vect (* s (xcor-vect v))
             (* s (ycor-vect v))))

(define (make-segment start end) (cons start end))
(define start-segment car)
(define end-segment cdr)

(let ([painter (begin ${code})]
      [frame (make-frame (make-vect 0 0) (make-vect 1 0) (make-vect 0 1))])
  (painter frame))`

  const style = window.getComputedStyle(document.body)
  const strokeColor = style.getPropertyValue("--text")
  console.log(strokeColor)

  BiwaScheme.define_libfunc("$line", 4, 4, (args: number[]) => {
    const [x1, y1, x2, y2] = args.map((x) => x * context.canvas.width)

    context.strokeStyle = strokeColor
    context.lineCap = "round"
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
  })

  let error = ""

  const interpreter = new BiwaScheme.Interpreter((err: any) => {
    error += err.toString()
  })
  interpreter.evaluate(fullCode)

  return error === "" ? undefined : error
}

function evaluateSchemeCode(code: string): string {
  initializeSchemeEnvironmenet()

  let resultHTML = ""

  const appendOutput = (old: string, newValue: string) => {
    if (old === "") return newValue
    return old + "<br>" + newValue
  }

  BiwaScheme.define_libfunc("display", 1, 1, (args: any) => {
    resultHTML =
      resultHTML +
      `<span style="font-style: italic">${args[0].toString()}</span>`
  })

  BiwaScheme.define_libfunc("newline", 0, 0, () => {
    resultHTML = resultHTML + "<br>"
  })

  const interpreter = new BiwaScheme.Interpreter((err: any) => {
    resultHTML = appendOutput(
      resultHTML,
      `<span style="color: var(--red)">${err.toString()}</span>`
    )
  })

  interpreter.evaluate(shim)

  interpreter.evaluate(code, (result: any) => {
    if (result) {
      resultHTML = appendOutput(
        resultHTML,
        `<span style="color: var(--green)">${result.toString()}</span>`
      )
    }
  })

  return resultHTML
}
