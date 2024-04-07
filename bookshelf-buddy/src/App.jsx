import { useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import LoginManager from './containers/loginManager';
import CategoryShelves from "./containers/CategoryShelves"
import {Container, Row, Col, Stack } from 'react-bootstrap'
import './stylesheets/App.css'

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

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
           <CategoryShelves />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App
