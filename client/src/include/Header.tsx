import {Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas} from 'react-bootstrap';
//{[false, 'sm', 'md', 'lg', 'xl', 'xxl'].map((expand) => (


const Header = () => {
    return(
        <>
        {/* false */}
        {['sm'].map((expand) => (
            <Navbar key={expand} expand={expand} className='bg-body-teriary mb-3'>
                <Container fluid>
                    <Navbar.Brand href="#">logo</Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}/>
                    <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                Open Canvas Menu
                            </Offcanvas.Title>
                        </Offcanvas.Header>

                        <Offcanvas.Body>
                            <Nav className='justify-content-end flex-grow-1 pe-3'>
                                <Nav.Link href="#">Home</Nav.Link>
                                <Nav.Link href="#">Link</Nav.Link>
                                <NavDropdown
                                title="BurgerKing"
                                id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    <NavDropdown.Item href="#">One</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Two</NavDropdown.Item>
                                    <NavDropdown.Item href="#">Three</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>

                            {/* 검색창 만들기 */}
                            <Form className='d-flex'>
                                <Form.Control
                                type="search"
                                placeholder='Meowwww'
                                className='me-2'
                                />
                                <Button variant="outline-success">Search</Button>
                            </Form>
                        </Offcanvas.Body>

                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        ))}
        </>
    )
}

export default Header;