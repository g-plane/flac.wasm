import { useState } from 'preact/hooks'
import Tabs from './components/Tabs'
import Flac from './components/Flac'
import Metaflac from './components/Metaflac'
import Footer from './components/Footer'

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
