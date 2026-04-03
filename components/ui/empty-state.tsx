"use client"

import type { ReactNode } from "react"
import { FolderOpen } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          {icon ?? <FolderOpen className="size-6 text-muted-foreground" />}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {action.label}
            </Link>
          ) : (
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
      </CardContent>
    </Card>
  )
}
