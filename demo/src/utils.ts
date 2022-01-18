import type { Terminal } from 'xterm'

export function writeCharToTerminal(terminal: Terminal, char: number) {
  if (char === 10) {
    terminal.writeln('')
  } else {
    terminal.write(Uint8Array.of(char))
  }
}
