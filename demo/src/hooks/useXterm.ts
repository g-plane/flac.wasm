import { useEffect, useRef } from 'preact/hooks'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'

export function useXterm() {
  const container = useRef<HTMLDivElement | null>(null)
  const instance = useRef<Terminal | null>(null)

  useEffect(() => {
    const terminal = new Terminal({
      rows: 18,
      disableStdin: true,
    })
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    if (container.current) {
      terminal.open(container.current)
      fitAddon.fit()
    }
    instance.current = terminal

    return () => {
      terminal.dispose()
      instance.current = null
    }
  }, [])

  return {
    terminalContainer: container,
    terminalInstance: instance,
  }
}
