'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'


export default function HeroSection() {

    return (
     
          <section>
                    <div className="relative pt-24">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="max-w-3xl text-center sm:mx-auto lg:mr-auto lg:mt-0 lg:w-4/5">

                                <h1 className="mt-8 text-balance text-4xl font-semibold md:text-5xl xl:text-6xl xl:[line-height:1.125]">Making Your Day Productive</h1>
                                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">You can assign your task here, and we will remind you about it. The AI will prioritize your task, making your work easier.</p>
                                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">Highly customizable components for building modern websites and applications, with your personal spark.</p>

                                <div className="mt-8">
                                    <Button size="lg" asChild>
                                        <Link href="/login">
                                            <Rocket className="relative size-4" />
                                            <span className="text-nowrap">Get Started</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-16">
                            <div aria-hidden className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%" />
                            <div className="relative mx-auto max-w-6xl overflow-hidden px-4">
                                <Image className="z-2 border-border/25 relative hidden rounded-2xl border dark:block" src="/ss.png" alt="app screen" width={2796} height={2008} />
                                <Image className="z-2 border-border/25 relative rounded-2xl border dark:hidden" src="/ss.png" alt="app screen" width={2796} height={2008} />
                            </div>
                        </div>
                    </div>
                </section>
    
    )
}
