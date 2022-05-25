import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import UserGestion from '../components/parameters/userGestion';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: "calc(100vh - 64px)" }}
        >
            <Box sx={{display:'flex', flexDirection:'column',width:'20%'}}>
                <Box sx={{backgroundColor: 'primary.main', p:2}}>
                    PARAMETERS
                </Box>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Tabs name "
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Tab label="Your informations" {...a11yProps(0)} />
                    <Tab label="Third-Party Association" {...a11yProps(1)} />
                    <Tab label="Notification" {...a11yProps(2)} />
                </Tabs>
            </Box>
        
            <TabPanel value={value} index={0} style={{width:'100%'}}>
                <UserGestion />
            </TabPanel>
            <TabPanel value={value} index={1} style={{width:'100%'}}>
                TODO : Third-Party Association
            </TabPanel>
            <TabPanel value={value} index={2} style={{width:'100%'}}>
                TODO : Notification
            </TabPanel>
        </Box>
    );
}
