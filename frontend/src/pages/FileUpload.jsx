import React, { useState } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8400";
const FileUpload = () => {

  const [files, setfiles] = useState({})

  const handleSubmit=async(e)=>{
    e.preventDefault();
    
    const formdata=new FormData()
      for (let i = 0; i < files.length; i++) {
            formdata.append("my-files", files[i]);
        }

    console.log(formdata.getAll("my-files"));
    
       const response = await fetch(`${API_URL}/api/upload/file-upload`, {
        method: "POST",
        body: formdata
      });
      const json = await response.json();
      console.log(json);
      

    

  }
  const fileHandle=async(e)=>{
    setfiles(Array.from(e.target.files));

  }

  return (
    <>
    <form onSubmit={handleSubmit}>
    <input type="file" multiple onChange={fileHandle} name="my-files" id="my-files" /><br/><br/><br/><br/>
    <button type="submit">Upload File</button>
    </form>
    
    </>
  )
}

export default FileUpload