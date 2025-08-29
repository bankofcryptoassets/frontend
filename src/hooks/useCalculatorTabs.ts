import { atom, useAtom } from 'jotai'

export const CALCULATOR_TAB = atom<'dca' | 'loan'>('dca')

export const useCalculatorTabs = () => {
  const [selected, setSelected] = useAtom(CALCULATOR_TAB)

  return { selected, setSelected }
}

export type SetSelected = (tab: 'dca' | 'loan') => void
