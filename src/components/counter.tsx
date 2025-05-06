'use client'
import { useState } from 'react'
import { Button } from '@heroui/button'

export const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <Button
      onPress={() => setCount(count + 1)}
      color="primary"
      variant="shadow"
    >
      Count is {count}
    </Button>
  )
}
