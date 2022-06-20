import React, { useEffect } from 'react'
import styled from 'styled-components'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';


const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(rgba(255,255,255,0.5),
    rgba(255,255,255,0.5)), url("https://t4.ftcdn.net/jpg/01/19/11/55/360_F_119115529_mEnw3lGpLdlDkfLgRcVSbFRuVl6sMDty.jpg"),
    center;

    display: flex;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
width: auto;
padding: 20px;
background-color: lightGrey;
`

const Title = styled.h1`
    margin: 10px;
    color: white;
    font-size: 24px;
    font-weight: 300;
`
const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 400px;
    
`
const Button = styled.button`
     border-radius: 5px;
background: gray;
    border: none;
    font-size: x-large;
    font-weight: 800;
    cursor: pointer;
    color: white;

             
`

const Login = () => {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
    const[password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(true);
    const [email, setEmail] = React.useState('');
    const[message,setMessage] = React.useState('');
    const vertical = "top";
    const horizontal = "right";


    useEffect(() => {
      localStorage.setItem('token', null)
      localStorage.setItem('isAdmin', null)
      }, [])

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

      const checkLoginStatus =() => {

          const data ={
            email: email,
            password: password
          }

      axios.post("https://testing-june.herokuapp.com/api/v1/login",data)
      .then(res => {
        setMessage(res.data.response)
          setOpen(true); 
        if(res.data.token !== undefined && res.data.token !== "No Token"){
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('isAdmin', res.data['object'].admin)
          navigate('/home');
        }
        else{
          localStorage.setItem('token', null)
          localStorage.setItem('isAdmin', null)
          navigate('/login');
        }
        
})
.catch(err => {
  navigate('/login');
})

}


  return (
    <Container>
    <Wrapper>
        <Title>Sign In</Title>
        <Form>
               <TextField style={{margin: "10px"}}
                label="Email"
                value={email}
                onChange={(event)=> setEmail(event.target.value)}
              />
              
            <FormControl  style={{margin: "10px"}} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword === true ? "password" : "text"}
          value={password}
          onChange={(event)=> setPassword(event.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                  onClick={()=>setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
        </Form>
        <Button onClick={()=>checkLoginStatus()}>Login</Button>
    </Wrapper>

      <Snackbar
       anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
      />
      
  </Container>
  )
}

export default Login
