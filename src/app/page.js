"use client"
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <ContainerScroll titleComponent={"querysage"} />
    </div>
  )
}