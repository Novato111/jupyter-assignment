import React from "react";
import { Button, Card } from "@nextui-org/react";
import {
  Plus,
  Code2,
  FileText,
  FolderOpen,
  Terminal,
  BookOpen,
} from "lucide-react";
import { useNotebookStore } from "../store/useNotebookStore";
import { CodeCell } from "./CodeCell";
import { MarkdownCell } from "./MarkdownCell";

export const FileEditor: React.FC = () => {
  const { files, activeFileId } = useNotebookStore();
  const activeFile = files.find((f) => f.id === activeFileId);

  const handleAddCell = () => {
    if (activeFileId) {
      const newCell = {
        id: crypto.randomUUID(),
        content: "",
        output: "",
        isExecuting: false,
        type: "code" as const,
        createdAt: new Date(),
      };
      useNotebookStore.getState().addCell(activeFileId, newCell);
    }
  };

  const handleAddMarkdownCell = () => {
    if (activeFileId) {
      const newCell = {
        id: crypto.randomUUID(),
        content: "",
        type: "markdown" as const,
        createdAt: new Date(),
      };
      //@ts-expect-error wip
      useNotebookStore.getState().addCell(activeFileId, newCell);
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
        <Card className="p-6 bg-black/40 backdrop-blur border border-white/10 shadow-lg text-center">
          <FolderOpen className="w-12 h-12 mx-auto text-white/30 mb-4" />
          <h2 className="text-lg font-medium text-white/80">
            No File Selected
          </h2>
          <p className="text-sm text-white/50">
            Create or select a file to start editing
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-black text-xs">
      <div className="max-w-6xl mx-auto p-4">
        <Card className="bg-black/40 backdrop-blur border border-white/10 shadow-lg">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
              </div>
              <h2 className="text-sm font-medium text-white/90 flex items-center gap-1">
                <FolderOpen size={16} className="text-white/50" />
                {activeFile.name}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                className="text-xs bg-green-500/20 hover:bg-green-500/30 border border-green-500/30"
                size="sm"
                startContent={<Code2 size={16} />}
                onClick={handleAddCell}
              >
                <span className="hidden sm:block "> Code Cell</span>
              </Button>
              <Button
                className="text-xs  bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
                size="sm"
                startContent={<FileText size={16} />}
                onPress={handleAddMarkdownCell}
              >
                <span className="hidden sm:block "> Markdown Cell</span>
              </Button>
            </div>
          </div>

          {/* Cells */}
          <div className="p-4 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
            {activeFile.cells.length === 0 ? (
              <div className="text-center py-8">
                <Plus className="w-8 h-8 mx-auto text-white/20 mb-2" />
                <p className="text-white/50">
                  Add a code or markdown cell to get started
                </p>
              </div>
            ) : (
              activeFile.cells.map((cell) =>
                cell.type === "code" ? (
                  <CodeCell key={cell.id} fileId={activeFile.id} cell={cell} />
                ) : (
                  <MarkdownCell
                    key={cell.id}
                    fileId={activeFile.id}
                    cell={cell}
                  />
                )
              )
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 bg-black/20 flex justify-between items-center text-white/50 text-xs">
            <div className="flex items-center gap-1">
              <Terminal size={14} />
              <span>{activeFile.cells.length} Cells</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>Last Saved: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
