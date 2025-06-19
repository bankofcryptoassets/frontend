import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@heroui/react'
import Image from 'next/image'
import { ReactNode } from 'react'

type StyledModalProps = {
  iconSrc: string
  title: string
  description: ReactNode
  primaryButtonText: string
  primaryButtonProps?: ButtonProps
  secondaryButtonText?: string
  secondaryButtonProps?: ButtonProps
}

export const StyledModal = ({
  iconSrc,
  title,
  description,
  primaryButtonText,
  primaryButtonProps,
  secondaryButtonText,
  secondaryButtonProps,
  ...props
}: Partial<ModalProps> & StyledModalProps) => {
  return (
    <Modal
      {...props}
      backdrop="blur"
      classNames={{
        backdrop: 'bg-black/50 backdrop-blur-sm',
        base: 'border border-foreground/10',
        closeButton:
          'bg-foreground/10 p-1 top-5 right-5 hover:bg-foreground/15 transition-colors',
      }}
      size="sm"
    >
      <ModalContent>
        <ModalHeader className="mt-1 justify-center border-b border-default-200/40">
          <h2>{title}</h2>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col items-center justify-center gap-5 py-10">
            <Image src={iconSrc} alt={title} width={60} height={60} />

            <p className="text-pretty text-center text-default-d">
              {description}
            </p>
          </div>
        </ModalBody>

        <ModalFooter className="flex-col pb-6 pt-0">
          <Button
            className="w-full font-bold text-white"
            {...primaryButtonProps}
          >
            {primaryButtonText}
          </Button>

          {secondaryButtonText && (
            <Button
              className="w-full font-bold text-default-a"
              variant="light"
              {...secondaryButtonProps}
            >
              {secondaryButtonText}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
