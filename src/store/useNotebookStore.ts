// This file contains the store for managing the state of the notebook application. using zustand
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { NotebookFile, CodeCell } from "../types";

// intereface for notebookstore
interface NotebookStore {
  files: NotebookFile[]; // Store an array of files (notebooks)
  activeFileId: string | null; // Tracks the currently active file by its ID
  addFile: (file: NotebookFile) => void; //  to add a new file
  removeFile: (id: string) => void; //  to remove a file by its ID
  setActiveFile: (id: string) => void; //  to set the currently active file
  addCell: (fileId: string, cell: CodeCell) => void; //  to add a new cell to a specific file
  updateCell: (fileId: string, cellId: string, content: string) => void; //  to update the content of a cell in a file
  updateCellOutput: (fileId: string, cellId: string, output: string) => void; // to update the output of a cell
  setCellExecuting: (
    fileId: string,
    cellId: string,
    isExecuting: boolean
  ) => void; //  to track if a cell is currently executing

  removeCell: (fileId: string, cellId: string) => void; // to remove a cell from a file
}

// Creates the store using Zustand also  applying the persist middleware to store the state in localStorage
export const useNotebookStore = create<NotebookStore>()(
  persist(
    (set) => ({
      files: [], // Initial state: empty array for files
      activeFileId: null, // Initial state: no active file
      addFile: (file) => set((state) => ({ files: [...state.files, file] })), // Add a file to the files array
      removeFile: (id) =>
        set((state) => ({ files: state.files.filter((f) => f.id !== id) })), // Remove a file by its ID
      setActiveFile: (id) => set({ activeFileId: id }), // Set the active file by its ID
      addCell: (fileId, cell) =>
        set((state) => ({
          files: state.files.map(
            (f) => (f.id === fileId ? { ...f, cells: [...f.cells, cell] } : f) // Add a cell to the specified file
          ),
        })),
      updateCell: (fileId, cellId, content) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  cells: f.cells.map(
                    (c) => (c.id === cellId ? { ...c, content } : c) // Update the content of the specified cell
                  ),
                }
              : f
          ),
        })),
      removeCell: (fileId, cellId) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  cells: f.cells.filter((c) => c.id !== cellId), // Remove the cell with the given cellId
                }
              : f
          ),
        })),
      updateCellOutput: (fileId, cellId, output) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  cells: f.cells.map(
                    (c) => (c.id === cellId ? { ...c, output } : c) // Update the output of the specified cell
                  ),
                }
              : f
          ),
        })),
      setCellExecuting: (fileId, cellId, isExecuting) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  cells: f.cells.map(
                    (c) => (c.id === cellId ? { ...c, isExecuting } : c) // Track if the specified cell is executing
                  ),
                }
              : f
          ),
        })),
    }),

    {
      name: "notebook-store", // This is the unique name for storing the state in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage for persisting the state
    }
  )
);
