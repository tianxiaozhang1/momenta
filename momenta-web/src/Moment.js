import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function Moment() {
  return (
    <Routes>
        <Route path=":id" element={<Post />} />
    </Routes>
  )
}

export default Moment
