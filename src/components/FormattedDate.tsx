type FormatedDateProps = {
  date: Date
}

export default function FormattedDate({ date }: FormatedDateProps) {
  return <div>{date.toLocaleDateString()}</div>
}
