import React, { useState, useEffect, useContext } from "react";
import { Button, Image, Card, Row, Container, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Dog from "./dog.jpg";
import "./home.css";
import LoadingSpinner from "../shared/Spinner";
import TokenContext from "../../context/TokenContext";
import placeholder from "../pets/placeholder.jpg";

export default function Home() {
  const [petList, setpetList] = useState("");
  const token = useContext(TokenContext);

  const renderCard = () => {
    return petList.map((pet) => {
      const link = pet.primary_photo_cropped;
      return (
        <Col md={4} xs={12} key={pet.id}>
          <Card className="card">
            <Card.Header className="card__header">
              {pet.name}
              <Button className="card__btn" as={Link} to={`/animal/${pet.id}`}>
                More Info
              </Button>
            </Card.Header>
            <Card.Img
              className="card__img"
              alt={link ? pet.type : `${pet.type} placeholder`}
              src={link ? link.medium : placeholder}
            />
            <Card.Body className="cardBody">
              <Card.Title className="card__title">
                {pet.breeds.primary}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };

  const renderCards = () => {
    return petList ? renderCard() : <LoadingSpinner />;
  };

  useEffect(() => {
    const fetchRandomPets = () => {
      const type = ["cat", "dog"];
      const randomType = type[Math.floor(Math.random() * type.length)];
      const config = { headers: { Authorization: `Bearer ${token}` } };
      fetch(
        `https://api.petfinder.com/v2/animals?type=${randomType}&location=19019&limit=3
        `,
        config
      )
        .then((response) => response.json())
        .then((data) => {
          setpetList(data.animals);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchRandomPets();
  }, [token]);

  return (
    <div className="home__container">
      <h1>Pawternity Hub</h1>
      <Image src={Dog} alt="doggo" roundedCircle id="dog" />
      <h2>Adopt a Buddy Today!</h2>
      <Button as={Link} to="/pets" variant="primary">
        Adopt
      </Button>
      <div className="featured__pets">
        <h2>Featured Pets</h2>
        <Container>
          <Row>{renderCards()}</Row>
        </Container>
      </div>
    </div>
  );
}
