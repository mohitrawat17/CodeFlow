import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const AskQuesn = ({setIsTerminal}) => {
  const textareaRef = useRef();
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const getResponse = async () => {
    const sendBtn = document.querySelector(".joinBtn");
    if (sendBtn) {
      sendBtn.disabled = true;
    }
    setLoading(true);
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: textareaRef.current.value }] }],
        },
      });
      if (response.data) {
        setResponseText(response.data.candidates[0].content.parts[0].text);
        textareaRef.current.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
    if (sendBtn) {
      sendBtn.disabled = false;
    }
  };

  return (
    <div className="right_wrapper">
      <div className="questionContainer">
        <textarea
          ref={textareaRef}
          placeholder="Ask Your Queries..."
        ></textarea>
        <div className="geminiButton">
          <button className="btn joinBtn" onClick={()=>setIsTerminal(true)}>Back</button>
          <button onClick={getResponse} className="btn joinBtn">
            Send
          </button>
        </div>
        <textarea
          readOnly
          value={loading ? "Prompt taken, generating output" : responseText}
        ></textarea>
      </div>
      <div className="outputSpace"></div>
    </div>
  );
};

export default AskQuesn;
