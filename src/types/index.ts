export interface NotebookFile {
  id: string;
  name: string;
  cells: CodeCell[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeCell {
  id: string;
  content: string;
  output: string;
  isExecuting: boolean;
  type: "code";
  createdAt: Date;
}

export interface JupyterHubConfig {
  baseUrl: string;
  token: string;
}

export interface MarkdownCell {
  fileId: string;
  cell: {
    id: string;
    content: string;
    type: "markdown";
  };
}
