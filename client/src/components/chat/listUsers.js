import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import userService from 'services/userService';
import {initSocket,getUsers} from 'services/sioService';

export default function ListUsers(props) {
    let navigate =useNavigate()
    const [users, setUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // SearchBar
    const [open, setOpen] = useState(false);
    const loading = open && users.length === 0;
    useEffect(() => {
        if (!loading) {
          return undefined;
        }
    
        userService.getAll().then(users => {
            setUsers(users);
        });
    }, [loading]);    
    
    // Select list
    const handleListItemClick = (event,index) => {
        navigate(`/chat/${users[index]._id}`)
        setSelectedIndex(index);
    };
    const handleSearch = (user) => {
        navigate(`/chat/${user._id}`)
    };
    
    // Get users TODO: get old conversations
    useEffect(() => {
        // Get users
        getUsers((err, data) => {
            setActiveUsers(data)
        })
        userService.getAll().then(users => {
            setUsers(users);
        });
    }, []);

  return (
    <React.Fragment>
        <Autocomplete
            open={open}
            clearOnEscape
            freeSolo
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onChange={(e, value) => handleSearch(value)}
            isOptionEqualToValue={(option, value) => option.username === value.username}
            getOptionLabel={(option) => option.username}
            options={users}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search among all users"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
        <Paper sx={{maxHeight: '85vh', overflow: 'auto'}}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {activeUsers.map((user,index) => (
                    <React.Fragment key={'index' + user._id}>
                        <ListItem alignItems="flex-start">
                            <ListItemButton
                                sx={{maxHeight: '100px', width: '100%'}}
                                selected={selectedIndex === index}
                                onClick={(event) => handleListItemClick(event, index)}
                            >
                                <ListItemAvatar>
                                    <Avatar 
                                        alt={user.username} 
                                        src={user.image || "/static/images/avatar/1.jpg"}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="h6"
                                            color="textPrimary"
                                            gutterBottom 
                                        >
                                            {user.username}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            sx={{  
                                                textOverflow: 'ellipsis', 
                                                overflow:'hidden',  
                                                whiteSpace: 'nowrap' 
                                            }}
                                        >
                                             "TODO :  Last messageLast messageLast messageLast messageLast messageLast messageLast message"       
                                        </Typography>
                                       
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    <Divider variant="inset" component="li" />
                </React.Fragment>
                ))}
            </List>
        </Paper> 
    </React.Fragment>
    
  );
}
