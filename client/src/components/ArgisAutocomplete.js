import {useState, useEffect, useMemo} from 'react';
import throttle from 'lodash/throttle';

import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import UserService from '../services/userService';

import { suggest, geocode } from "@esri/arcgis-rest-geocoding";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
const authentication = ApiKeyManager.fromKey(process.env.REACT_APP_ARCGIS_API_KEY);

export default function ArgisAutocomplete() {
    const [shared, setShared] = useState(false);
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const handleShare = () => {
        setShared(!shared);
        UserService.setPublic(!shared);
    }

    const fetch = useMemo(
        () =>
            throttle((request) => {
                suggest(request,{authentication}).then(response => {
                    let newOptions = [];
      
                    if (value) {
                        newOptions = [value];
                    }
      
                    if (response.suggestions) {
                        newOptions = [...newOptions, ...response.suggestions];
                    }
      
                    setOptions(newOptions);
                });
            },500),
        [],
    );

    useEffect(() => {
        let active = true;
    
        if (!authentication) {
          return undefined;
        }
    
        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ inputValue }, (results) => {
            if (active) {
              let newOptions = [];
      
              if (value) {
                newOptions = [value];
              }
      
              if (results) {
                newOptions = [...newOptions, ...results];
              }
      
              setOptions(newOptions);
            }
        });
      
        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    useEffect(() => {
        async function fetchData() {
            UserService.getUser().then(user => {
                if (user?.public) setShared(user.public)
                if (user?.adress) setValue(user.address)
            });
        }
        fetchData();
    }, []);

    return (
        <Grid container direction='column' spacing={1} alignContent='center'>
            <Grid item>
                <Autocomplete
                    id="autocompleteArgis"
                    size="small"
                    value={value}
                    sx={{ maxWidth: 200}}
                    options={options}
                    autoComplete
                    noOptionsText="No locations found"
                    includeInputInList
                    freeSolo
                    filterSelectedOptions
                    filterOptions={(x) => x} 
                    getOptionLabel={(option) =>
                        typeof option === 'string' ? option : option.text
                    }
                    onChange={(event, newValue) => {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                        if (newValue) {
                            geocode({
                                authentication,
                                singleLine: newValue.text,
                                magicKey: newValue.magicKey
                            }).then(response => {
                                UserService.setLocation(
                                    [response.candidates[0].location.x,
                                    response.candidates[0].location.y],
                                    response.candidates[0].address
                                );
                                console.log('value',value)
                                console.log('input',inputValue)
                                console.log(options)
                            })
                        }
                    }}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    isOptionEqualToValue={(option, value) => {
                        return option?.magicKey === value?.magicKey;
                    }}
                    renderInput={(params) => 
                        <TextField {...params} />
                    }
                />
            </Grid>
            <Grid item>
                <Switch
                    checked={shared}
                    onChange={handleShare}
                    inputProps={{ 'aria-label': 'controlled' }}
                    size="small" 
                    color="secondary"
                />
                Share Location
            </Grid>
        </Grid>
    );
}
