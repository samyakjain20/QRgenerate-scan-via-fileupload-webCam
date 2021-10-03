import React, {useState, useRef} from 'react';
import './App.css';
import {Container, Card, CardContent, makeStyles, Grid, TextField, Button} from '@material-ui/core';
import QRCode from 'qrcode';
import QRReader from 'react-qr-reader';
import { BarcodeReader } from 'dynamsoft-javascript-barcode';

function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scannedDetails, setscannedDetails] = useState('');
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const classes = useStyles();
  const qrRef = useRef(null);
  
  const generateQrCode = async () => {
    try{
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    }catch(error){
      console.log(error);
    }
  }

  const handleErrorFile= (error) => {
    console.log(error);
  }

  const handleScanFile = async (result) => {
    if (result) {
      setScanResultFile(result);
      let reader = await BarcodeReader.createInstance();
      let res = await reader.decode(scanResultFile);
      if(res.length === 0){
        console.log("No Barcode Detected")
        setscannedDetails(res.barcodeText);
      } else{
        setscannedDetails(res.barcodeText);
        console.log(res.barcodeText);
      }
    }
  }
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
  }
  const  handleScanWebCam =  (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  }

  return (
    <Container className={classes.container}>
      <Card>
        <h2 className={classes.title}>Scan QR from Aadhar</h2>
        <CardContent>
          <Grid container spacind={2}>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <TextField label="Enter Your QR" onChange={(e) => setText(e.target.value)} />
              <Button className={classes.btn} variant="contained" color="primary" onClick={() => generateQrCode()}>Generate</Button>
              <br/>
              <br/>
              <br/>
              {imageUrl ? (
              <a href={imageUrl} download> <img src={imageUrl} alt="img" /> </a>) : null}
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <Button className={classes.btn} variant="contained" color="secondary" onClick={onScanFile}>Scann QR Code</Button>
              <QRReader
                ref={qrRef} 
                delay={300}
                style={{width: '100%'}}
                onError={handleErrorFile}
                onScan={handleScanFile}
                legacyMode
              />
              <h3>Scanned Code: {scanResultFile}</h3>
              <h3>Details from Scann: {scannedDetails}</h3>
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <h3>QR Code Scan by Web Cam</h3>
              <QRReader
                delay={300}
                style={{width: '100%'}}
                onError={handleErrorWebCam}
                onScan ={handleScanWebCam} 
              />
              <h3>Scanned By WebCam Code: {scanResultWebCam}</h3>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: "#fff",
    padding: 20
  },
  btn: {
    marginTop: 10,
    marginBottom: 20
  }
}));
export default App;