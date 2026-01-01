import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Portal>
    <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg ${className}`}
      {...props}
    />
  </AlertDialogPrimitive.Portal>
))

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props} />
)

const AlertDialogFooter = ({ className, ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />
)

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={`text-lg font-semibold ${className}`} {...props} />
)
)
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={`text-sm text-slate-500 ${className}`} {...props} />
)
)
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900/90 ${className}`} {...props} />
)
)
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} className={`mt-2 inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 sm:mt-0 ${className}`} {...props} />
)
)

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}