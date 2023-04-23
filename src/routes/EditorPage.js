import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "../../src/editor.css";
import Client from "../components/Client";
import Terminal from "../components/Terminal";
import MainEditor from "../components/MainEditor";
import { initSocket } from "../components/socket.js";
import ACTIONS from "../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";

const EditorPage = () => {
  console.log("start");
  const [clients, setClients] = useState([]);
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { editorId } = useParams();
  const [code, setCode] = useState("");
  const [sendToTerminal, setSendToTerminal] = useState(false);

  const handleSendToTerminal = () => {
    setSendToTerminal(true);
  };
  const init = async () => {
    socketRef.current = await initSocket();
    socketRef.current.on("connect_error", (err) => handleErrors(err));
    socketRef.current.on("connect_failed", (err) => handleErrors(err));

    function handleErrors(e) {
      console.log("socket error", e);
      toast.error("socket connection failed,try again later !", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      reactNavigator("/");
    }

    socketRef.current.emit(ACTIONS.JOIN, {
      editorId,
      username: location.state?.userName,
    });

    // joining event listen
    socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
      if (username !== location.state?.userName) {
        toast.success(`${username} joined`, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        code: codeRef.current,
        socketId,
      });
      setClients(clients);
    });

    //disconnection
    socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
      toast.warn(`${username} left.`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setClients((prev) => {
        return prev.filter((c) => c.socketId !== socketId);
      });
    });
  };

  useEffect(() => {
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(editorId);
      toast.success("Room id has been copied", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (e) {
      toast.error("failed to copy room id ! ", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(e);
    }
  };

  const exitRoom = () => {
    return reactNavigator("/");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }
  console.log("End");
  return (
    <>
      <div className="wrapper">
        <div className="left_wrapper">
          <div className="left_inner">
            <div className="logo">
              <img src="/code.png" alt="code flow" />
              <h1 className="codeflow">Code Flow</h1>
            </div>

            <h4>Connected Users</h4>

            <div className="clients">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <div className="left_outer">
            <button className="btn cpybtn" onClick={copyId}>
              COPY ROOM ID
            </button>
            <button className="btn leavebtn" onClick={exitRoom}>
              EXIT
            </button>
          </div>
        </div>

        <div className="right_wrapper">
          <MainEditor
            socketRef={socketRef}
            editorId={editorId}
            codeChange={(code) => {
              setCode(code);
            }}
          />
          <button className="btn" onClick={handleSendToTerminal}>
            Send to Terminal
          </button>
          {sendToTerminal && <Terminal pycode={code} sendToTerminal= {sendToTerminal} />}
        </div>
      </div>
    </>
  );
};

export default EditorPage;
