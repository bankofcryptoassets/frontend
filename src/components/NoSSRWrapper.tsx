'use client'
import dynamic from 'next/dynamic'
import { Fragment, PropsWithChildren } from 'react'

const NoSSRWrapper = ({ children }: PropsWithChildren) => (
  <Fragment>{children}</Fragment>
)

export default dynamic(() => Promise.resolve(NoSSRWrapper), { ssr: false })
