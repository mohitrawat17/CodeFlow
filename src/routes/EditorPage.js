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
import MainTerminal from "./MainTerminal.jsx";
import codemirror from "codemirror";
import AskQuesn from "./AskQuesn.jsx";

const EditorPage = () => {
  // console.log("start");
  const [clients, setClients] = useState([]);
  const [code, setCode] = useState("");

  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { editorId } = useParams();
  const [isTerminal, setIsTerminal] = useState(true)

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

      //auto sync on first load
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




  return (
    <>
      <div className="wrapper">
        <div className="left_wrapper">
          <div className="left_inner">
            <div className="logo">
              <h1 className="codeflow">Code Flow</h1>
            </div>

            <h4>Active Users</h4>

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

        {isTerminal ? (
          <MainTerminal
          isTerminal={isTerminal}
          setIsTerminal={setIsTerminal}
            socketRef={socketRef}
            editorId={editorId}
            codeRef={codeRef}
            code={code}
            setCode={setCode}
          />
        ) : (
          <AskQuesn setIsTerminal={setIsTerminal}/>
        )}
      </div>
    </>
  );
};

export default EditorPage;
