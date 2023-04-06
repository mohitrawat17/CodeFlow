import React, { useEffect, useRef} from 'react';
import Codemirror from 'codemirror';
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/theme/dracula.css';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/javascript/javascript'



const MainEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
    editorRef.current=Codemirror.fromTextArea(document.getElementById("html_space"), {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
      });
          editorRef.current.on('change',(instance,changes)=>{
            console.log('changes',changes);
          })
    }
    init();

    // return ()=>{
    //   editor.toTextArea()
    // }
  }, []);

  
  return <textarea id='html_space'></textarea>
}

export default MainEditor;
