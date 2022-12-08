import { h } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import AppState from '../../appState'

const CopyButton = ({ copyRef }) => {
  const { stores, currentPokemon } = useContext(AppState)
  if (!currentPokemon.value.id || !currentPokemon.value.version) return ''
  const copied = useSignal(0)
  useEffect(async () => {
    copied.value = 0
  }, [currentPokemon.value.id, currentPokemon.value.version])

  const onClick = async () => {
    const htmlCode = copyRef.current.innerHTML
    const blobInput = new Blob([htmlCode], { type: 'text/html' })
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/html': blobInput })
    ])
    copied.value++
  }

  return (
    <button style='width:100%' onClick={onClick}>
      {!copied.value ? 'Click here to copy' : `Copied! ${copied.value}`}
    </button>
  )
}

export default CopyButton
