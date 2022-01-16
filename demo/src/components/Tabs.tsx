interface Props {
  activeTab: string
  onTabChange(name: string): void
}

export default function Tab({ activeTab, onTabChange }: Props) {
  return (
    <div class="tabs is-centered is-boxed is-medium mt-4">
      <ul>
        <li
          class={activeTab === 'flac' ? 'is-active' : ''}
          onClick={() => onTabChange('flac')}
        >
          <a>flac.wasm</a>
        </li>
        <li
          class={activeTab === 'metaflac' ? 'is-active' : ''}
          onClick={() => onTabChange('metaflac')}
        >
          <a>metaflac.wasm</a>
        </li>
      </ul>
    </div>
  )
}
