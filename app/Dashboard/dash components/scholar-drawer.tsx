import { X } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import { useState } from "react"
import ScholarBarChart from "./scholar-bar-chart"
import { Button } from '@/components/ui/button'

const ScholarDrawer = ({ row }: { 
  row: { 
    getValue: (key: string) => string;
    original: any;
  } 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={() => {}}>
        <SheetTrigger asChild>
          <div
            className="capitalize cursor-pointer hover:underline hover:text-blue-500"
            onClick={() => setIsOpen(true)}
          >
            {row.getValue("name")}
          </div>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Scholar Details: {row.getValue("name")}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetHeader>
          <div className="py-6">
            <ScholarBarChart />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ScholarDrawer;

