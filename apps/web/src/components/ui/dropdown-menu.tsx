"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, Circle } from "lucide-react"

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextValue | undefined>(
  undefined
)

function useDropdownContext() {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown")
  }
  return context
}

interface DropdownProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

function Dropdown({ children, defaultOpen = false }: DropdownProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const { setOpen, open } = useDropdownContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(!open)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownTrigger.displayName = "DropdownTrigger"

interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
}

const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(
  ({ children, className, align = "end", ...props }, ref) => {
    const { open, setOpen } = useDropdownContext()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [open, setOpen])

    if (!open) return null

    const alignClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0",
    }

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownContent.displayName = "DropdownContent"

interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ children, className, inset, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
DropdownItem.displayName = "DropdownItem"

const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ children, className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
DropdownLabel.displayName = "DropdownLabel"

const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownSeparator.displayName = "DropdownSeparator"

const DropdownCheckbox = React.forwardRef<
  HTMLDivElement,
  {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    children: React.ReactNode
  } & React.HTMLAttributes<HTMLDivElement>
>(({ checked, onCheckedChange, children, className, ...props }, ref) => {
  const handleSelect = () => {
    onCheckedChange(!checked)
  }

  return (
    <DropdownItem
      ref={ref}
      className={cn("cursor-pointer", className)}
      onClick={handleSelect}
      {...props}
    >
      <span className="flex h-4 w-4 items-center justify-center">
        {checked ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3 opacity-50" />}
      </span>
      {children}
    </DropdownItem>
  )
})
DropdownCheckbox.displayName = "DropdownCheckbox"

const DropdownSub = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props}>
    {children}
  </div>
))
DropdownSub.displayName = "DropdownSub"

const DropdownSubTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; inset?: boolean } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, inset, ...props }, ref) => (
  <DropdownItem
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownItem>
))
DropdownSubTrigger.displayName = "DropdownSubTrigger"

const DropdownSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
DropdownSubContent.displayName = "DropdownSubContent"

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownCheckbox,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
}
