"use client"
import { useEffect } from 'react'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import Navbar from '@/components/Navbar'
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import FeaturesSectionDemo from '@/components/blocks/features-section-demo-2'
import ContainerScrollTitle from '@/components/Hero'

export default function Home() {
  const { data: session, status } = useSession()
  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/dashboard')
    }
  }, [status])
  return (
    <div className="p-4">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
      <Navbar />
      <ContainerScrollTitle />
      <FeaturesSectionDemo />
      <div className='container flex justify-center'>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it Safe?</AccordionTrigger>
            <AccordionContent>
              Yes it is safe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. Its animated by default, but you can disable it if you prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}