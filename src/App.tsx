import React from 'react';
import Book from './components/Book';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Book />} />
          <Route path="/books" element={<Book />} />
          <Route path="/books/:id/" element={<Book />} />
          <Route path="/books/:id/:userId" element={<Book />} />
          <Route path="/books/:id/:userId/:position" element={<Book />} />
        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </>
  );
}

export default App;
