import React, { useState } from "react";
import Terminal from "../components/Terminal";
import MainEditor from "../components/MainEditor";

const MainTerminal = ({ socketRef, editorId, codeRef, setIsTerminal }) => {
  const [sendToTerminal, setSendToTerminal] = useState(false);
  const handleSendToTerminal = () => {
    setSendToTerminal(true);
  };
  const [code, setCode] = useState("");

  return (
    <>
      <div className="right_wrapper">
        <MainEditor
          socketRef={socketRef}
          editorId={editorId}
          codeChange={(code) => {
            codeRef.current = code;
            // setCode(code);
          }}
          codeChangeSet={(code) => {
            setCode(code);
            setSendToTerminal(false);
          }}
        />
        <div className="terminalOutputBtn">
        <button className="runBtn" onClick={()=>setIsTerminal(false)}>
          Ask AI
        </button>
        <button className="runBtn" onClick={handleSendToTerminal}>
          Run code
        </button>
        </div>
        {sendToTerminal && (
          <Terminal pycode={code} handleSendToTerminal={handleSendToTerminal} />
        )}
      </div>
    </>
  );
};

export default MainTerminal;
