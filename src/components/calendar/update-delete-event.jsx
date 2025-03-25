import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Bookmark, Plus, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const UpdateDeleteEvent = () => {
    return (
        <Dialog>
            <DialogContent className="sm:max-w-[425px] bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-700 z-50">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your event and click "Create".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Enter event title"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Enter event description"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">
                            Start Date
                        </Label>
                        <Input
                            id="startDate"
                            type="datetime-local"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">
                            End Date
                        </Label>
                        <Input
                            id="endDate"
                            type="datetime-local"
                            className="col-span-3"
                        />
                    </div>
                    {/* Color Picker */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            <Bookmark className="h-4 w-4" />
                        </Label>
                        {/*<div className="col-span-3 flex flex-wrap gap-2">*/}
                        {/*    {colorOptions.map((color) => (*/}
                        {/*        <button*/}
                        {/*            key={color}*/}
                        {/*            className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? "border-gray-800 dark:border-gray-200" : "border-transparent"}`}*/}
                        {/*            style={{backgroundColor: color}}*/}
                        {/*            onClick={() => setSelectedColor(color)}*/}
                        {/*            type="button"*/}
                        {/*            aria-label={`Select color ${color}`}*/}
                        {/*        >*/}
                        {/*            {(selectedColor === color) && (*/}
                        {/*                <CheckIcon className="text-white w-4 h-4"/>*/}
                        {/*            )}*/}
                        {/*        </button>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                    </div>
                </div>
                {/*<DialogFooter>*/}
                {/*    <Button*/}
                {/*        type="submit"*/}
                {/*        onClick={handleCreateEvent}*/}
                {/*        disabled={loading || !title || !start || !end}*/}
                {/*    >*/}
                {/*        {loading ? "Creating..." : "Create"}*/}
                {/*    </Button>*/}
                {/*</DialogFooter>*/}
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDeleteEvent;