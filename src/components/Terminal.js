import React, { useState, useEffect } from "react";
import axios from "axios";

const Terminal = ({ pycode }) => {
  const [output, setOutput] = useState(null);

  const runCode = async (code) => {
    const encodedParams = new URLSearchParams();
    encodedParams.append("code", 'print("Hello World!")');
    encodedParams.append("language", "py");

    const options = {
      method: 'POST',
  url: 'https://python-3-code-compiler.p.rapidapi.com/',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': '099f807d9fmshad70fc6c376eecap1252afjsn09442e0827d0',
    'X-RapidAPI-Host': 'python-3-code-compiler.p.rapidapi.com'
  },
  data: `{"code":${code},"version":"latest","input":null}`
    };
    try {
      axios.request(options).then(function (response) {
        console.log(response.data);
        setOutput(output);
      }).catch(function (error) {
        console.error(error);
      });
  }catch(err){
    console.log(err);
  }

  }
  useEffect(() => {
    runCode(pycode);
  }, [pycode]);

  return <div className="outputSpace">hello</div>;
};

export default Terminal;
