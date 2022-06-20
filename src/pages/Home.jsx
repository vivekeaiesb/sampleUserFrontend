import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PreviewIcon from '@mui/icons-material/Preview';


const Container = styled.div`
  width: 100vw;
    height: 100vh;
  background: darkgrey;

  display: flex;
    align-items: center;
    justify-content: center;
`
const Wrapper = styled.div`
padding: 20px;
border-radius: 20px;
background-color: azure;
box-shadow:  -5px -5px -10px #5a5a5a,
             -5px -5px -10px #ffffff;
`


const Table = styled.div`
    height: 400px;
    width: 800px;
    background: aliceblue;
`

const Home = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const[message,setMessage] = useState('');
  const vertical = "top";
  const horizontal = "right";

  const [admin, setAdmin] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [userID, setUserID] = useState('');


  const [onlyView, setOnlyView] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const [users, setUsers] = useState([]);

  const getRowsWithID = (rows) => {

    let id = 0;
    let CompleteRowListArray = []

    for(let row of rows){
      const rowWithID = {
        id: id,
        ...row
      }
      id++
      CompleteRowListArray.push(rowWithID)
    }

    return CompleteRowListArray
  }

  const decoded = jwt_decode(localStorage.getItem('token'));
    const authAxios = axios.create({
      // baseURL: `http://localhost:8500/api/v1/`,
      baseURL: `https://testing-june.herokuapp.com/api/v1`,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
    })

  const getUsers = async() => {
    if (decoded.exp < Date.now() / 1000) {
      
      navigate('/login');
    }
    else{
      try{
        const res = await authAxios.get(`/sampleUsers`)  ;
        setUsers(getRowsWithID(res.data['object'])) 
      } 
      catch(e){
  
      }
    }
    
   }

  useEffect(()=>{
       getUsers();
  },[])

  const deleteUser = (event) => {
  
    if (decoded.exp < Date.now() / 1000) {
      
      navigate('/login');
    }
    else{
          authAxios.delete(`/sampleUsers/${event.id}`)
          .then( res => { 
            setMessage(res.data.response)
            setOpen(true); 
            getUsers(); 
          }) 
        .catch(e => {

        })
    }
  }

  const isAdmin = () => {
    if(localStorage.getItem("isAdmin") === "true"){
      return false;
    }
    else{
      return true;
    }
  }

  const handleClickOpen = (event,e) => {
   
    if(event.row === undefined){
        setAdmin('');
        setGender('');
        setName('');
        setAge('');
        setEmail('');
        setPassword('');
        setUserID('');
        setOnlyView(false);
        setOpenDialog(true);
    }
    else{
        setOnlyView(e !== undefined ? true : false)
        setAdmin(event.row.admin);
        setGender(event.row.gender);
        setName(event.row.name);
        setAge(event.row.age);
        setEmail(event.row.email);
        setUserID(event.row._id);
        setOpenDialog(true);
    }
    
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const save = () => {
    if(name === ""){
      setMessage("Enter Name")
      setOpen(true); 
    }
    else if(email === ""){
      setMessage("Please enter Email Address")
      setOpen(true); 
    }
    else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            setMessage("Invalid Email Address")
            setOpen(true); 
    }
    else if(gender === ""){
            setMessage("Please choose gender")
            setOpen(true); 
    }
    else if(userID === "" && password === ""){
      setMessage("Please enter password")
      setOpen(true); 
    }
   
    else{
      const data ={
        name: name,
        age: age,
        gender: gender,
        admin: admin === "" ? false: admin,
        email: email,
        password: password,
      }
          
      if (decoded.exp < Date.now() / 1000) {
        
        navigate('/login');
      }
      else{
              if(userID === ""){
                authAxios.post(`/sampleUsers`, data)
                .then( res => {
                  setAdmin('');
                  setGender('');
                  setName('');
                  setAge('');
                  setEmail('');
                  setPassword('');
                  setUserID('');
                  setMessage(res.data.response)
                  setOpen(true); 
                  setOpenDialog(false)
                  getUsers(); 
                }) 
              .catch(e => {
      
              })
              }
              else if(userID !== ""){
                data["_id"] = userID
                authAxios.put(`/sampleUsers`, data)
                .then( res => {
                  setAdmin('');
                  setGender('');
                  setName('');
                  setAge('');
                  setEmail('');
                  setPassword('');
                  setUserID('');
                  setMessage(res.data.response)
                  setOpen(true); 
                  setOpenDialog(false)
                  getUsers(); 
                }) 
              .catch(e => {
      
              })
              }
                
      }
    }
  }

  const columns = [
    { field: 'actions', 
      type: 'actions', 
      width: 100,
      getActions: (event) => [
        <GridActionsCellItem icon={<PreviewIcon/>} onClick={(e)=>handleClickOpen(event,e)} label="View" />,
          <GridActionsCellItem  disabled={isAdmin()} icon={<DeleteIcon/>} onClick={()=> deleteUser(event)} label="Delete"/>,
          <GridActionsCellItem disabled={isAdmin()} icon={<EditIcon/>} onClick={()=>handleClickOpen(event)} label="Edit"/>
      ], 
    },
     { field: 'id', headerName: 'ID', width: 50 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'gender', headerName: 'Gender', width: 130 },
    { field: 'age', headerName: 'Age', width: 130 },
    { field: 'email', headerName: 'Mail',sortable: false, width: 200},
  ];

  return (
    <Container>
      
        <Wrapper>
            <Button variant="contained" disabled={isAdmin()} onClick={handleClickOpen} 
                    endIcon={<PersonAddAltIcon />}>
              Add User
            </Button>
            <Table>
            <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[5]}
            checkboxSelection
            />
          </Table>

          <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle hidden={onlyView} id="alert-dialog-title">
          {
             userID === "" ? "Add User" : "Edit User"
          }
        </DialogTitle>
        <DialogTitle hidden={!onlyView} id="alert-dialog-title">
          View User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{padding: "10px"}}>
            <Grid container spacing={2}>
              <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField  style={{width: "220px"}} id="outlined-basic"  disabled={onlyView} label="Enter name" variant="outlined" 
                            value={name} onChange={(event)=> setName(event.target.value)}/>
              </Grid>
              <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl style={{width: "220px"}}>
                    <InputLabel id="demo-simple-select-label" >Admin</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={admin}
                      label="Admin"
                      disabled={onlyView}
                      onChange={(event)=> setAdmin(event.target.value)}
                    >
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField style={{width: "220px"}} id="outlined-basic" label="Enter age" variant="outlined" 
                            disabled={onlyView} value={age} onChange={(event)=> setAge(event.target.value)} />
              </Grid>
              <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl style={{width: "220px"}}>
                    <InputLabel id="demo-simple-select-label" >Gender</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={gender}
                      disabled={onlyView}
                      label="Gender"
                      onChange={(event)=> setGender(event.target.value)}
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item  xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField style={{width: "220px"}} id="outlined-basic" label="Enter email" variant="outlined" 
                          disabled={onlyView} value={email} onChange={(event)=> setEmail(event.target.value)}/>
              </Grid>
              <Grid item  xs={12} sm={12} md={6} lg={6} xl={6} hidden={ userID === "" ? false : true}>
                  <FormControl  style={{width: "220px"}} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password" >Password</InputLabel>
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
                        label="Enter Password"
                      />
                    </FormControl>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpenDialog(false)}>Cancel</Button>
          <Button onClick={save} autoFocus disabled={onlyView}>
          {
               userID === "" ? "Save" : "Update"
          }
          </Button>
        </DialogActions>
      </Dialog>

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

export default Home
