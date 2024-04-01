import * as React from "react"
import { Alert, TextField, Tooltip } from "@mui/material";
import Button from "@mui/joy/node/Button";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { apiLink } from "../config";

const UrlRequest = (props) => {
  const [result, setResult] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
    
  const [formData, setFormData] = React.useState({
      url: '',
    });

  const handleTextChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (props.process =="shorten" && formData.url.length < 50) {
        setResult({message:"URL is too short.", success: '0'})
      }
      else if (props.process =="expand" && formData.url.length > apiLink.length + 8) {

        setResult({message:"URL is too long.", success: '0'})
      } else {
        const response = await fetch(apiLink + props.process, {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        if (!response.ok) {
          setResult({message:"Failed to execute process", success: '0'})
        }
  
        const responseData = await response.json();
        setResult(responseData);

      }
      

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
     <h2>{props.requestHeader}</h2>
      <TextField id="long_url" name="url" label={props.inputLabel} variant="outlined" onChange={handleTextChange} fullWidth/>
      <Button variant="outlined" style={{marginTop: "1em"}} onClick={handleSubmit} loading={loading} disabled={!formData.url}>{props.buttonLabel}</Button>

      {result && (
      <div style={{marginTop:"2em"}}>
          <div hidden={result.success == '0'}>
            <Alert variant="outlined" color="success">
                {result.message}
            </Alert>

            <h2>{props.resultHeader}</h2>
            <TextField id="outlined-basic" variant="outlined" value={result.short_url ? result.short_url : result.long_url} disabled fullWidth/> 
            <Tooltip title="Copy" style={{marginTop: "1em"}}>
                <Button variant="outlined" color="success" onClick={() => {navigator.clipboard.writeText(result.short_url ? result.short_url : result.long_url); setCopied(true)}}  disabled={copied}>{copied ? "Copied" : <ContentPasteIcon/>}</Button>
            </Tooltip>
          </div>

          <div hidden={result.success == '1'}>
          <Alert variant="outlined" color="error">
              {result.message}
          </Alert>
          </div>
      </div>
      )}
    </>
   
  )
}

export default UrlRequest

export const Head = () => <title>URL Request</title>