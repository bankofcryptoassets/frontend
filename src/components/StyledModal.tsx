import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@heroui/react'
import Image from 'next/image'

export const StyledModal = (props: Partial<ModalProps>) => {
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
        <ModalHeader className="mt-1 justify-center">
          <h2>Modal Title</h2>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col items-center justify-center gap-5 py-10">
            <Image
              src="/icons/approve.png"
              alt="Approve icon"
              width={60}
              height={60}
            />

            <div>Lorem ipsum dolor sit amet</div>
          </div>
        </ModalBody>

        <ModalFooter className="flex-col">
          <Button className="w-full font-bold text-white" color="secondary">
            Approve
          </Button>

          <Button className="w-full text-default-a" variant="light">
            Review Investment Details
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
