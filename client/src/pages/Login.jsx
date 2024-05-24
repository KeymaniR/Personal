import { useContext } from "react";
import {Alert, Button, Form, Row, Col, Stack} from "react-bootstrap"; {/*This is how we would import 'tags' for bootstrap*/}
import { AuthContext } from "../context/AuthContext";


const Login = () => {


    //Extract Info from Auth Context
    const {loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading} = useContext(AuthContext)


    return <>
    <Form onSubmit={loginUser}>
        <Row style = {{height: "100vh", justifyContent:"center", paddingTop: "20%"}}>
            <Col xs={6}>
                <Stack gap ={3}>
                    <h2>Login</h2>

                    
                    <Form.Control type="email" placeholder="Email" onChange = {(e) => updateLoginInfo
                    ({...loginInfo, email: e.target.value})
                    }
                    />
                    <Form.Control type="password" placeholder="Password" onChange = {(e) => updateLoginInfo
                    ({...loginInfo, password: e.target.value})
                    }/>
                    <Button variant="success" type="submit">
                       {isLoginLoading? "Logging in..." : "Login"}
                    </Button>
                    {loginError?.error && <Alert variant="danger"><p>{loginError?.message}</p></Alert>}
                    
                </Stack>
            </Col>
        </Row>
    </Form>
    
    </>;
}
 
export default Login;