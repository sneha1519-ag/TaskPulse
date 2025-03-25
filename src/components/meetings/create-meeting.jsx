import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Bookmark, CalendarIcon, CheckIcon, Clock} from "lucide-react";
import {Label} from "@/components/ui/label";

const colorOptions = [
    "#7986CB",
    "#33B679",
    "#8E24AA",
    "#E67C73",
    "#F6BF26",
    "#F4511E",
    "#039BE5",
    "#616161",
    "#3F51B5",
    "#0B8043",
    "#D50000"
];

const CreateMeetingDialog = ({ isOpen, onClose, onSave }) => {
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Schedule a Meeting</DialogTitle>
                </DialogHeader>

                {/* Meeting Title */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Meeting Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter meeting title"
                        required
                    />

                    {/* Meeting Description */}
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Meeting Description
                    </label>
                    <Textarea
                        placeholder="Enter meeting description"
                    />

                    {/* Date Picker */}
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Input
                            type="date"
                            required
                        />
                        <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>

                    {/* Time Pickers */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    type="time"
                                    required
                                />
                                <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                End Time <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    type="time"
                                    required
                                />
                                <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    {/* Color Picker */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right"><Bookmark/></Label>
                        <div className="col-span-3 flex gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    className={`w-5 h-5 rounded-full border-2
                                    ${selectedColor === color ? "" : "border-transparent"}
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    {(selectedColor === color) && (<CheckIcon className="text-white w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <DialogFooter className="mt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateMeetingDialog;
