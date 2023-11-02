import { useState } from 'preact/hooks'
import Flac from './components/Flac'
import Footer from './components/Footer'
import Metaflac from './components/Metaflac'
import Tabs from './components/Tabs'

export function App() {
  const [activeTab, setActiveTab] = useState('flac')

  return (
    <>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'flac' && <Flac />}
      {activeTab === 'metaflac' && <Metaflac />}
      <Footer />
    </>
  )
}
