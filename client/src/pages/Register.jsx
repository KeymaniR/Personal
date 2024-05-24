import { useContext } from "react";
import {Alert, Button, Form, Row, Col, Stack} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
 {/*This is how we would import 'tags' for bootstrap*/}


const Register = () => {
const {registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading} = useContext(AuthContext); {/* The variable name has to be the same as the how it is named in the AuthContext file */}
return <>
    <Form onSubmit={registerUser}>
        <Row style = {{height: "100vh", justifyContent:"center", paddingTop: "20%"}}>
            <Col xs={6}>
                <Stack gap ={3}>
                    <h2>Register</h2>

                    <Form.Control type="text" placeholder="Name" onChange={(e) => updateRegisterInfo({...registerInfo, name: e.target.value})}/>
                    <Form.Control type="email" placeholder="Email" onChange={(e) => updateRegisterInfo({...registerInfo, email: e.target.value})}/>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => updateRegisterInfo({...registerInfo, password: e.target.value})}/>
                    <Button variant="success" type="submit">
                        {
                        isRegisterLoading ? "Creating your Account" : "Register"
                        }
                    </Button>
                    {
                        registerError?.error &&(
                          <Alert variant="danger">
                            <p>{registerError?.message}</p>
                            </Alert>
                    )}
                   
                </Stack>
            </Col>
        </Row>
    </Form>
    
    </>;
}
 
export default Register;