import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ContentSection() {
    return (
        <section id='solution' className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">Task Pulse is your all-in-one productivity tool designed to streamline task management and improve efficiency.</h2>
                    <div className="space-y-6">
                        <p>Task Pulse is an AI-powered task management platform that helps individuals and teams stay organized and productive. Our taskpulse lets you assign tasks, receive reminders, and leverage AI-based prioritization to focus on what matters most. The Kanban board provides a clear visual of task progress, while the integrated meeting feature ensures seamless collaboration.</p>
                        <p>
                         <span className="font-bold">With Task Pulse, you can track your progress through an intuitive dashboard with insightful graphs and automatically schedule projects in the built-in calendar.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
