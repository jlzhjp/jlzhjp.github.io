type FormattedDateProps = {
  date: Date
}

export default function FormattedDate({ date }: FormattedDateProps) {
  return <div>{date.toLocaleDateString()}</div>
}
