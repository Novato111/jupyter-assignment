import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { FileText, FolderOpen, Plus, Search, Menu } from "lucide-react";
import { useNotebookStore } from "../store/useNotebookStore";
import { z } from "zod"; // zod validation
import { Alert } from "@heroui/alert";
import { Divider } from "@heroui/divider";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";

const fileNameSchema = z
  .string()
  .min(1, "File name cannot be empty")
  .max(15, "File name cannot exceed 15 characters")
  .regex(/^[^<>:"/\\|?*]+$/, "File name contains invalid characters")
  .regex(/\.py$/, "File name must end with .py");

export const FileList: React.FC = () => {
  const { files, activeFileId, setActiveFile } = useNotebookStore();
  const [newFileName, setNewFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control

  const handleCreateFile = () => {
    try {
      fileNameSchema.parse(newFileName); // Validate the file name
      const newFile = {
        id: crypto.randomUUID(),
        name: newFileName,
        cells: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      useNotebookStore.getState().addFile(newFile);
      setNewFileName("");
      onClose(); // Close the modal after creating the file
    } catch (error) {
      if (error instanceof z.ZodError) {
        setAlert({
          title: "Validation Error",
          description: error.errors[0].message,
        });
      }
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <Button
        isIconOnly
        className="fixed top-2 right-2 z-50 bg-black/80 text-white md:hidden"
        onPress={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={20} />
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed rounded-lg h-screen inset-y-0 left-0 z-40 w-56 p-2 bg-gradient-to-r from-gray-950 to-black backdrop-blur-md border border-white/10 shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-white/90">Files</h2>
          <Tooltip content="Create new file">
            <Button
              isIconOnly
              color="default"
              size="sm"
              className="bg-blue-500/40 hover:bg-blue-500/30 border border-blue-500/30 transition-all duration-300"
              onPress={onOpen}
            >
              <Plus size={16} className="text-blue-300" />
            </Button>
          </Tooltip>
        </div>

        <Divider className="my-2 bg-white/10" orientation="horizontal" />
        <Input
          placeholder="Search files..."
          size="sm"
          className="mb-2  backdrop-blur-md text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search size="12px" className="text-white/50" />}
        />

        <div className="space-y-1">
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <FolderOpen className="h-8 w-8 text-white/30" />
              <h3 className="mt-2 text-xs font-medium text-white/80">
                No files found
              </h3>
              <p className="text-xs text-white/50 mt-1">
                {files.length === 0
                  ? "Create your first Python file to get started"
                  : "No files match your search"}
              </p>
              {files.length === 0 && (
                <Button
                  onPress={onOpen}
                  variant="bordered"
                  size="sm"
                  className="mt-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 transition-all duration-300"
                >
                  Create File
                </Button>
              )}
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center p-1 rounded cursor-pointer transition-all duration-300 ${
                  activeFileId === file.id
                    ? "bg-blue-500/20 border border-blue-500/30"
                    : "hover:bg-white/10 border border-transparent"
                }`}
                onClick={() => setActiveFile(file.id)}
              >
                <FileText size={16} className="mr-1 text-white/70" />
                <span className="text-xs text-white/90">{file.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for file creation */}
      <Modal className="dark text-white" isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent className="z-40 bg-gradient-to-br from-gray-950 to-black border border-white/10 shadow-2xl">
          <ModalHeader className="text-sm font-semibold text-white/90">
            Create New File
          </ModalHeader>
          <ModalBody>
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name"
              size="sm"
              className=" backdrop-blur-md bordertext-xs"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              color="danger"
              variant="bordered"
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 transition-all duration-300"
              onPress={onClose}
            >
              Close
            </Button>
            <Button
              color="primary"
              size="sm"
              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 transition-all duration-300"
              onPress={handleCreateFile}
            >
              Create
            </Button>
            {alert && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-96 z-60">
                <Alert
                  color="danger"
                  className="transition-all ease-in-out duration-300 opacity-100 bg-red-500/20 border border-red-500/30"
                  description={alert.description}
                  title="File name error"
                  onClose={() => setAlert(null)} // Clear the alert when closed
                />
              </div>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
