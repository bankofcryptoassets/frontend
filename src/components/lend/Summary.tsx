import { Card, CardBody, CardFooter, CardHeader, Spinner } from '@heroui/react'

type Props = {
  loanSummary: {
    minDownPayment: string
    principalAmount: string
    monthlyEMI: string
    interestAmount: string
    totalPayable: string
    assetReceived: string
  }
  isLoading: boolean
}

export const Summary = ({ loanSummary, isLoading }: Props) => {
  return (
    <Card className="relative z-0 w-full">
      {isLoading && (
        <div className="absolute inset-0 z-[1] grid place-items-center bg-default/50 p-4 backdrop-blur-sm">
          <Spinner color="secondary" />
        </div>
      )}

      <CardHeader className="bg-default-300 p-3 px-4 font-bold">
        Summary
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>Lending Amount</div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.minDownPayment}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>Max Time Period</div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.principalAmount}
              </span>{' '}
              USDC
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex w-full gap-4 p-0">
        <div className="w-full space-y-2 bg-default-300 p-2">
          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>Monthly Recievable</div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.assetReceived}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>Maximum Yeild Recd</div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.monthlyEMI}
              </span>{' '}
              USDC
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
