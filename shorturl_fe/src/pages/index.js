import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from '../images/logo.png'
import UrlRequestForm from '../components/UrlRequestForm'


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const IndexPage = () => {
  
  const [value, setValue] = React.useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <div style={{textAlign:"center"}}>
      <img src={logo} centered></img>
    </div>

    <Box sx={{marginLeft: '10%', marginRight: '10%'}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Shorten Link" {...a11yProps(0)} />
          <Tab label="Expand Link" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UrlRequestForm requestHeader="Shorten URL" 
                      resultHeader="Shortened URL"
                      buttonLabel="SHORTEN" 
                      inputLabel="Long URL"
                      process="shorten"/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <UrlRequestForm requestHeader="Show Original URL" 
                      resultHeader="Original URL"
                      buttonLabel="SHOW" 
                      inputLabel="Short URL"
                      process="expand"/>

      </CustomTabPanel>
    </Box>
    </>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
