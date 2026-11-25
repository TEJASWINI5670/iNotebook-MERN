import React from 'react'
import { Link } from 'react-router'

const Sample = () => {
  return (
      <>
       <Link to={`${7%2===0 ? "https://www.google.com":"https://www.facebook.com"}`}>{7%2===0?<b style={{backgroundColor:"red",color:"white"}}>Google</b>:<b style={{backgroundColor:"green",color:"white"}}>FaceBook</b>}</Link>
      </>
     
  )
}

export default Sample