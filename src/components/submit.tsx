'use client'
import { Button } from "@/components/ui/button"
import { useFormStatus } from 'react-dom'
 
export default function SubmitButton({children}:{children : string}) {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" disabled={pending}>
      {children}
    </Button>
  )
}