import { ArrowUpRightIcon, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

const EmptyOrders = () => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Video className="w-4 h-4" />
                </EmptyMedia>
                <EmptyTitle>No Videos Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any videos yet. Get started by creating
                    your first video.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button>Create Video</Button>
                    <Button variant="outline">Browse Video</Button>
                </div>
            </EmptyContent>
            <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <a href="#">
                    Learn More <ArrowUpRightIcon />
                </a>
            </Button>
        </Empty>
    )
}

export default EmptyOrders;