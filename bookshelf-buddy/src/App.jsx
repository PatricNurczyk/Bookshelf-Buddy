import { useState, useEffect } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LoginManager from './containers/loginManager';
import CategoryShelves from "./containers/CategoryShelves"
import {Container, Row, Col, Stack } from 'react-bootstrap'
import './stylesheets/App.css'

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (user !== undefined && user.email) {
      let url = 'http://localhost:8080/login_check?email=' + user.email;
      console.log(url)
      fetch(url)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
  }, []);


  return (
    <>
      <LoginManager isAuthenticated={isAuthenticated}></LoginManager>
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
           <CategoryShelves user={isAuthenticated === true ? user.email : undefined}/>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App
