import React, { useState } from "react";
import { Card, Button, Textarea } from "@nextui-org/react";
import { Play, Loader, Code, Trash } from "lucide-react";
import { useNotebookStore } from "../store/useNotebookStore";
import { executeCode } from "../services/api";

interface CodeCellProps {
  fileId: string;
  cell: {
    id: string;
    content: string;
    output: string;
    isExecuting: boolean;
  };
}

export const CodeCell: React.FC<CodeCellProps> = ({ fileId, cell }) => {
  const { updateCell, updateCellOutput, setCellExecuting, removeCell } =
    useNotebookStore();
  const [isExecuting, setIsExecuting] = useState(cell.isExecuting);

  const handleExecute = async () => {
    try {
      setCellExecuting(fileId, cell.id, true);
      setIsExecuting(true);

      const output = await executeCode(cell.content);

      updateCellOutput(fileId, cell.id, output);
    } catch (error) {
      updateCellOutput(fileId, cell.id, String(error));
    } finally {
      setCellExecuting(fileId, cell.id, false);
      setIsExecuting(false);
    }
  };

  const handleDelete = () => {
    removeCell(fileId, cell.id);
  };

  return (
    <Card className="group p-3 mb-3 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-lg border border-white/10 shadow-sm rounded-lg hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-grow">
          <div className="flex items-center mb-1">
            <Code size={14} className="text-white/40" />
            <span className="ml-1 text-[11px] text-white/40">Python Code</span>
          </div>
          <Textarea
            value={cell.content}
            onChange={(e) => updateCell(fileId, cell.id, e.target.value)}
            placeholder="Enter Python code..."
            className="font-mono text-white/90 bg-black/80 border-transparent hover:border-teal-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all duration-300 ease-in-out"
            minRows={6}
            size="sm"
            style={{
              caretColor: "#4ade80",
              lineHeight: "1.5",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1 mt-5">
          <Button
            isIconOnly
            color="success"
            onPress={handleExecute}
            isLoading={isExecuting}
            className="bg-green-500/20 hover:bg-green-500/30 transition-all duration-200 group-hover:scale-105"
            size="sm"
          >
            {isExecuting ? (
              <Loader className="animate-spin" size={14} />
            ) : (
              <Play className="text-green-400" size={14} />
            )}
          </Button>
          <Button
            isIconOnly
            color="danger"
            onPress={handleDelete}
            className="bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 group-hover:scale-105"
            size="sm"
          >
            <Trash className="text-red-400" size={14} />
          </Button>
        </div>
      </div>

      {/* Output Section */}
      {cell.output && (
        <div className="mt-2 relative">
          <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-green-500/30 rounded-full"></div>
          <div className="p-2 bg-white/5 rounded-md border border-white/10 font-mono  overflow-x-auto">
            <div className="flex items-center mb-1">
              <span className=" text-white/40">Output</span>
            </div>
            <pre className="text-green-400/90 whitespace-pre-wrap break-words">
              {cell.output}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
};
