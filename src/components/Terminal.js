import React, { useState, useEffect } from "react";
import axios from "axios";

const Terminal = ({ pycode,handleSendToTerminal }) => {
  console.log(pycode);

  const [output, setOutput] = useState(null);

  const runCode = async (code) => {
    const encodedParams = new URLSearchParams();
    encodedParams.append("code", 'print("Hello World!")');
    encodedParams.append("language", "py");
    const options = {
      method: 'POST',
      url: 'https://online-code-compiler.p.rapidapi.com/v1/',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '86f5db25e9msha4d81f0c379916cp1616c1jsn412f3334967d',
        'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
      },
      data: {
        language: 'python3',
        code: `${pycode}`,
        version: "latest",
        input: null,
      },
    };
    try {
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data.output);
          setOutput(response.data.output);
          handleSendToTerminal();

        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    runCode(pycode);
  }, [pycode]);

  return <>
    <div className="outputSpace">{output}</div>
    {/* <div>{handleSendToTerminal()}</div> */}
  </>
};

export default Terminal;
