"use client";
import { useState } from "react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CirclePlus, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const HomeSection = () => {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
    const [updatedName, setUpdatedName] = useState("");

    // Function to save a new project
    const handleSaveProject = () => {
        if (projectName.trim() !== "") {
            setProjects([...projects, projectName]);
            setProjectName(""); // Clear input
            setOpenDialog(false); // Close dialog after saving
        }
    };

    // Function to delete a project
    const handleDeleteProject = (index) => {
        const updatedProjects = projects.filter((_, i) => i !== index);
        setProjects(updatedProjects);
    };

    // Function to open rename dialog
    const handleOpenRenameDialog = (index) => {
        setSelectedProjectIndex(index);
        setUpdatedName(projects[index]);
        setRenameDialogOpen(true);
    };

    // Function to save renamed project
    const handleSaveRenamedProject = () => {
        if (updatedName.trim() !== "") {
            const updatedProjects = [...projects];
            updatedProjects[selectedProjectIndex] = updatedName;
            setProjects(updatedProjects);
            setRenameDialogOpen(false); // Close rename dialog
        }
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {/* Projects Section */}
                    {projects.length > 0 && (
                        <SidebarMenuItem>
                            <SidebarMenuSubItem>
                                {projects.map((project, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <SidebarMenuSubButton>{project}</SidebarMenuSubButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical className="w-4 h-4 cursor-pointer" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenRenameDialog(index)}>Change Name</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteProject(index)}>Delete Project</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                            </SidebarMenuSubItem>
                        </SidebarMenuItem>
                    )}

                    {/* Add Project Button */}
                    <SidebarMenuItem>
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <SidebarMenuButton className="mt-1">
                                    <CirclePlus className="mr-2" />
                                    Add Project
                                </SidebarMenuButton>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add a New Project</DialogTitle>
                                    <DialogDescription>
                                        Enter your project name below.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="project-name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="project-name"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            placeholder="Enter project name"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleSaveProject}>
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>

            {/* Rename Project Dialog */}
            <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rename Project</DialogTitle>
                        <DialogDescription>Update the project name below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rename-project" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="rename-project"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveRenamedProject}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarGroup>
    );
};
