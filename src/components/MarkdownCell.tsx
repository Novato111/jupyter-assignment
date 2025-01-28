import React, { useState } from "react";
import { Card, Button, Divider } from "@nextui-org/react";
import { FileText, Edit3, Save, Trash } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Textarea } from "@heroui/input";
//@ts-expect-error asdasd
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-expect-error asasd
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useNotebookStore } from "../store/useNotebookStore";

export interface MarkdownCellProps {
  fileId: string;
  cell: {
    id: string;
    content: string;
    type: "markdown" | "code";
  };
}

export const MarkdownCell: React.FC<MarkdownCellProps> = ({ fileId, cell }) => {
  const { updateCell, removeCell } = useNotebookStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => setIsEditing(false);
  const handleEdit = () => setIsEditing(true);

  const handleDelete = () => {
    removeCell(fileId, cell.id); // This will remove the cell from the notebook
  };

  return (
    <Card className="group p-4 mb-4 bg-background border-gray-700 rounded-lg">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-grow" onClick={handleEdit}>
          <div className="flex items-center text-xs text-gray-400 gap-1 mb-2">
            <FileText size={12} className="text-green-100" /> Markdown
          </div>
          <Divider className="my-2" />

          {isEditing ? (
            <Textarea
              value={cell.content}
              onChange={(e) => updateCell(fileId, cell.id, e.target.value)}
              placeholder="Type Markdown content..."
              className="font-mono text-sm bg-black/60 border-gray-700 rounded focus:ring focus:ring-teal-500 p-2"
              style={{
                caretColor: "#4ade80",
                lineHeight: "1.5",
                fontSize: "0.875rem",
              }}
            />
          ) : (
            <div className="text-gray-300 prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                children={cell.content || demo}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={dracula}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ ...props }) => (
                    <h1 {...props} className="text-3xl text-blue-500 mb-2">
                      {props.children}
                    </h1>
                  ),
                  h2: ({ ...props }) => (
                    <h2 {...props} className="text-2xl text-green-400 mb-2">
                      {props.children}
                    </h2>
                  ),
                  p: ({ ...props }) => (
                    <p {...props} className="text-gray-200 text-sm mb-2">
                      {props.children}
                    </p>
                  ),
                  strong: ({ ...props }) => (
                    <strong {...props} className="text-yellow-400">
                      {props.children}
                    </strong>
                  ),
                  em: ({ ...props }) => (
                    <em {...props} className="italic text-purple-400">
                      {props.children}
                    </em>
                  ),
                  a: ({ ...props }) => (
                    <a {...props} className="text-blue-400 hover:text-blue-600">
                      {props.children}
                    </a>
                  ),
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            isIconOnly
            size="sm"
            onPress={isEditing ? handleSave : handleEdit}
            className={
              !isEditing
                ? " bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-200 group-hover:scale-105 text-white"
                : "bg-green-500/20 hover:bg-green-500/30 transition-all duration-200 group-hover:scale-105 text-white"
            }
            color={isEditing ? "success" : "default"}
            startContent={isEditing ? <Save size={14} /> : <Edit3 size={14} />}
          ></Button>

          {/* Delete Button */}
          <Button
            isIconOnly
            size="sm"
            onPress={handleDelete}
            className="bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 group-hover:scale-105 text-white"
            color="danger"
          >
            <Trash size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const demo = `# Welcome to Your Jupyter Notebook Clone! 🚀

### Key Features:
- **Interactive Code Execution**: Write and execute code in various languages right within your notebook.
- **Rich Markdown Support**: Use Markdown to format text, create headings, add images, links, and more, with full color and style customization.
- **Syntax Highlighting**: View code in beautifully highlighted blocks, making it easier to read and understand.
- **Real-Time Updates**: Make changes to your cells, save your work, and see updates in real-time.

### How to Get Started:
1. **Create a New file**: Start by creating a new notebook file to organize your work.
2. **Add Markdown and Code Cells**: You can add both Markdown cells to write explanations and Code cells to execute your scripts.
3. **Execute Code**: Click "Run" to execute code in the Code cells and see the output right below the code.


### Tips for Writing Markdown:
- Use **headers** to structure your content and make it easier to navigate.
- Highlight important information using **bold** or *italic* text.
- Add code blocks with **syntax highlighting** for easy reading.
- Embed links and images to enhance your documentation.

We hope this platform helps you to efficiently code, document, and share your work in a clean and organized manner. Happy coding! 💻✨
`;
