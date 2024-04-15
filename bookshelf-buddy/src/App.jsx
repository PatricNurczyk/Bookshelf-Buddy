import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LoginManager from './containers/loginManager';
import CategoryShelves from "./containers/CategoryShelves"
import {Container, Row, Col, Stack } from 'react-bootstrap'
import Popup from './containers/Popup';
import axios from 'axios'
import './stylesheets/App.css'

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userID, setUserID] = useState(0);
  const [buttonAddBook, setAddBook] = useState(false);
  const [bookData, setbookData] = useState({
    title: '',
    pageCount: '',
    cover: null, // For file uploads
  });

  const addBookClick = (category_id) => {
    setAddBook(true);
  };

  const handleBookInputChange = (event) => {
    const { name, value } = event.target;
    setbookData({
      ...bookData,
      [name]: value,
    });
  };

  const newCat = async (category) => {
    try{
      const response = await axios.post('http://localhost:8080/addCategory', {
        id : userID,
        category : category
      });
      console.log('Category uploaded successfully:', response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setbookData({
      ...bookData,
      cover: file,
    });
  };

  const handleSubmitAddBook = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title',bookData.title);
    formData.append('pageCount', bookData.pageCount);
    formData.append('image', bookData.cover);
    formData.append('id', userID);
    console.log(userID);

    try{
      const response = await axios.post('http://localhost:8080/addBook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Book uploaded successfully:', response.data);
      setAddBook(false);
    } catch (error) {
      return
    }

    // Reset form fields after submission
    setbookData({
      title: '',
      pageCount: '',
      cover: null,
    });
  };

  useEffect(() => {
    if (user !== undefined && user.email) {
      let url = 'http://localhost:8080/login_check?email=' + user.email;
      console.log(url)
      fetch(url)
        .then(res => res.json())
        .then(data => setUserID(data[0].user_id))
        .catch(error => console.error(error));
    }
  }, [user]);


  return (
    <>
      <LoginManager isAuthenticated={isAuthenticated}></LoginManager>
      {isAuthenticated ? (
        <Container className='bookshelf p-0'>
        <Row className='rounded-top shelf' >
              <h1>
                {isAuthenticated === true ? "Welcome " + user.name : "Please Log In"}
              </h1>
        </Row>
        <Row>
          <Col className='shelf trophy p-0' xs={5} md={3}>
            <Stack>
              Trophy Section
            </Stack>
          </Col>
          <Col className='shelf main-shelf p-0'>
           <CategoryShelves newCat={newCat} user={isAuthenticated === true ? user.email : undefined} addBookClick={addBookClick}/>
          </Col>
        </Row>
      </Container>
      ) : (
      <div>
        <h1>
          Welcome To Bookshelf Buddy
        </h1>
        <h1>
          Log In To View Your Bookshelf
        </h1>
      </div>
      )}
      <Popup title="Add Book" trigger={buttonAddBook} onClose={setAddBook}>
      <form onSubmit={handleSubmitAddBook}>
        <div className="form-group">
          <label htmlFor="title">Book Title: </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={bookData.title}
            onChange={handleBookInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pageCount">Page Count: </label>
          <input
            type="number"
            className="form-control"
            id="pageCount"
            name="pageCount"
            value={bookData.pageCount}
            onChange={handleBookInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cover">Cover Image: </label>
          <input
            type="file"
            className="form-control-file"
            id="cover"
            name="cover"
            accept=".jpg, .jpeg, .png" // Accept image file types
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Add Book
        </button>
      </form>
      </Popup>
    </>
  );
};

export default App
