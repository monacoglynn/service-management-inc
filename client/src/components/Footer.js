import React from "react";
import { Container, Row, Col } from "react-bootstrap";
const Footer = () => {
    return (
        <footer>
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        Copyright &copy; Team{" "}
                        <a href="https://github.com/caubenondo" target="_blank">
                            {" "}
                            Hai{" "}
                        </a>{" "}
                        |{" "}
                        <a
                            href="https://github.com/monacoglynn"
                            target="_blank"
                        >
                            {" "}
                            Patrick{" "}
                        </a>
                        |{" "}
                        <a
                            href="https://github.com/responsibleparty"
                            target="_blank"
                        >
                            {" "}
                            Cecilia{" "}
                        </a>
                        |{" "}
                        <a href="https://github.com/richmonddz" target="_blank">
                            {" "}
                            Richmond{" "}
                        </a>
                        |{" "}
                        <a
                            href="https://github.com/Marshall-Rust"
                            target="_blank"
                        >
                            {" "}
                            Marshall{" "}
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
