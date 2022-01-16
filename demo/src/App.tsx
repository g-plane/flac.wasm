import { useState } from 'preact/hooks'
import Tabs from './components/Tabs'
import Flac from './components/Flac'

export function App() {
  const [activeTab, setActiveTab] = useState('flac')

  return (
    <>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'flac' && <Flac />}
    </>
  )
}
