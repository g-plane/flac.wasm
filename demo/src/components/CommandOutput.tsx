interface Props {
  text: string
}

export default function CommandOutput(props: Props) {
  return (
    <div
      class="has-text-info-light has-background-grey-dark px-3 py-2 rounded w-full h-70 overflow-auto text-sm font-mono"
      dangerouslySetInnerHTML={{ __html: nl2br(props.text.trim()) }}
    ></div>
  )
}

function nl2br(text: string): string {
  return text.replace(/\n/g, '<br>')
}
