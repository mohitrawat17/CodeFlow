import React, { useState, useEffect } from "react";
import axios from "axios";

const Terminal = ({ pycode,handleSendToTerminal }) => {
  // console.log(pycode);

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
          console.log(response.data);
          setOutput(response.data.output);
          // handleSendToTerminal();

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
  }, []);

  return <>
    {
      !output?
      <div style={{paddingLeft:"20px"}}>Loading please wait ....</div>
      :
      <div className="right_wrapper" 
     style={{paddingBottom:"40px",paddingRight:"20px",paddingLeft:"20px"}} 
     dangerouslySetInnerHTML={{ 
         __html: output.split('\n').map(line => `>>  ${line}`).join('<br>') 
     }} 
/>

    }
  </>
};

export default Terminal;


