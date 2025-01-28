const config = {
  baseUrl: "http://localhost:8000",
  token: "",
};

let kernelId: string | null = null;
let ws: WebSocket | null = null;
const messageCallbacks: Map<string, (result: string) => void> = new Map();

let wsReady = false; // Track WebSocket readiness
let reconnecting = false;

// Delay function to wait for WebSocket to be ready
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createKernel = async (): Promise<string> => {
  try {
    const response = await fetch(`${config.baseUrl}/user/admin/api/sessions`, {
      method: "POST",
      headers: {
        Authorization: `token ${config.token}`,

        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: "string",
        name: "string",
        type: "string",
      }),
    });

    if (!response.ok)
      throw new Error(
        "Failed to create kernel Please check your token,  Logout and login again with valid token"
      );

    const data = await response.json();

    kernelId = data.kernel.id; // Set kernel ID from response
    await connectWebSocket();
    return kernelId as string;
  } catch (error) {
    console.error("Error creating kernel:", error);
    throw error;
  }
};

const connectWebSocket = () => {
  if (!kernelId) return;

  const wsUrl = `ws://localhost:8000/user/admin/api/kernels/${kernelId}/channels?token=${config.token}`;
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("WebSocket connected");
    wsReady = true; // Mark WebSocket as ready
  };

  ws.onmessage = handleMessage;
  ws.onerror = (error) => console.error("WebSocket error:", error);
  ws.onclose = handleClose;
};

const handleMessage = (event: MessageEvent) => {
  const msg = JSON.parse(event.data);

  if (
    msg.header.msg_type === "execute_result" ||
    msg.header.msg_type === "stream"
  ) {
    const msgId = msg.parent_header.msg_id;
    const callback = messageCallbacks.get(msgId);

    if (callback) {
      const output = msg.content.text || msg.content.data["text/plain"];
      callback(output);
      messageCallbacks.delete(msgId);
    }
  }

  if (msg.header.msg_type === "error") {
    const msgId = msg.parent_header.msg_id;
    const callback = messageCallbacks.get(msgId);

    if (callback) {
      const errorMessage = msg.content.traceback.join("\n");
      callback(errorMessage);
      messageCallbacks.delete(msgId);
    }
  }
};

const handleClose = () => {
  console.log("WebSocket closed");
  if (!reconnecting) {
    reconnecting = true;
    setTimeout(async () => {
      console.log("Attempting to reconnect WebSocket...");
      await connectWebSocket();
      reconnecting = false;
    }, 5000);
  }
};

const executeCode = async (code: string): Promise<string> => {
  if (!kernelId || !ws || !wsReady) {
    await createKernel();
  }

  // Wait for WebSocket to be ready before executing code
  while (!wsReady) {
    console.log("Waiting for WebSocket to be ready...");
    await delay(500); // Wait 500ms before checking again
  }

  return new Promise((resolve, reject) => {
    const msgId = crypto.randomUUID();
    messageCallbacks.set(msgId, resolve);

    const message = {
      header: {
        msg_id: msgId,
        msg_type: "execute_request",
        username: "admin",
        session: crypto.randomUUID(),
        date: new Date().toISOString(),
        version: "5.0",
      },
      content: {
        code: code,
        silent: false,
        store_history: true,
        user_expressions: {},
        allow_stdin: false,
      },
      metadata: {},
      parent_header: {},
    };

    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));

      setTimeout(() => {
        if (messageCallbacks.has(msgId)) {
          messageCallbacks.delete(msgId);
          reject(new Error("Code execution timeout"));
        }
      }, 30000);
    } else {
      reject(new Error("WebSocket not connected"));
    }
  });
};

const setAuthToken = (token: string) => {
  config.token = token;
  localStorage.setItem("authToken", token);
};

const savedToken = localStorage.getItem("authToken");
if (savedToken) {
  config.token = savedToken;
}

const isTokenValid = async (token: string): Promise<boolean> => {
  // try {
  //   const response = await fetch(
  //     `${config.baseUrl}/hub/api/authorizations/token/${token}`,
  //     {
  //       method: "GET",

  //       headers: {
  //         Authorization: `token ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   alert(token);
  console.log(token);
  return true;
  // } catch (error) {
  //   console.error("Error validating token:", error);
  //   alert("error");
  //   return false;
  // }
};

const disconnect = () => {
  if (ws) {
    console.log("Closing WebSocket connection...");
    ws.close();
    ws = null; // Set ws to null to indicate it's disconnected
    kernelId = null; // Reset kernelId
    wsReady = false;
    console.log("WebSocket disconnected");
  }
};

// For checking WebSocket connection status
const checkWebSocketStatus = () => {
  if (ws?.readyState === WebSocket.OPEN) {
    console.log("WebSocket is connected");
  } else if (
    ws?.readyState === WebSocket.CLOSING ||
    ws?.readyState === WebSocket.CLOSED
  ) {
    console.log("WebSocket is closed or closing");
  } else {
    console.log("WebSocket is not connected");
  }
};

checkWebSocketStatus();

export { executeCode, setAuthToken, savedToken, isTokenValid, disconnect };
