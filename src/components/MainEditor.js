import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/theme/dracula.css';
import 'codemirror/lib/codemirror.css';
import ACTIONS from '../Actions';
import 'codemirror/mode/python/python'



const MainEditor = ({ socketRef, editorId, codeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(document.getElementById("cpp"), {
        lineNumbers: true,
        // value: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}`, // Set the initial code content
        mode:'python',
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true
      })

      editorRef.current.setSize(null,"500px");



      editorRef.current.on('change', (instance, changes) => {
        // console.log('changes', changes);
        const { origin } = changes;
        const code = instance.getValue(); //to get text in editor
        codeChange(code);
        // console.log(code);
           
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            editorId,
            code,   // send the codes of one user to other
          });

        }
      });
    }
          

    init();
  }, []);



  useEffect(() => {

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {

      socketRef.current.off(ACTIONS.CODE_CHANGE);

    };

  }, [socketRef.current])

  console.log("main editor");

  return <textarea id='cpp'></textarea>
}

export default MainEditor;
