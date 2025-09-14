import { atom, useAtom } from 'jotai'

export const CTA_TABS = atom<'dca' | 'loan'>('dca')

export const useCTATabs = () => {
  const [selected, setSelected] = useAtom(CTA_TABS)

  return { selected, setSelected }
}

export type SetSelected = (tab: 'dca' | 'loan') => void
