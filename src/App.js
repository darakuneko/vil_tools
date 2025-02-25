import React, { useState, useCallback } from 'react';
import { Button, Checkbox, FormControlLabel, TextField, Typography, Container, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import { vial2c } from './vial2c.js';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

function App() {
  const [jsonA, setJsonA] = useState(null);
  const [jsonB, setJsonB] = useState(null);
  const [jsonC, setJsonC] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const itemsToDisplay = ["macro", "tap_dance", "combo", "key_override", "settings"];

  const handleFileUploadA = useCallback((event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedJson = JSON.parse(e.target.result);
        setJsonA(parsedJson);
      } catch (error) {
        alert("Error parsing JSON A: " + error);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileUploadB = useCallback((event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedJson = JSON.parse(e.target.result);
        setJsonB(parsedJson);
      } catch (error) {
        alert("Error parsing JSON B: " + error);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileUploadC = useCallback((event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedJson = JSON.parse(e.target.result);
        setJsonC(parsedJson);
      } catch (error) {
        alert("Error parsing JSON C: " + error);
      }
    };
    reader.readAsText(file);
  }, []);

  const downloadJson = () => {
    if (!jsonA || !jsonB) {
      alert("Please upload Source and Target files.");
      return;
    }

    const newJsonB = { ...jsonB };

    itemsToDisplay.forEach(item => {
      if (selectedItems.includes(item) && jsonA[item]) {
        newJsonB[item] = jsonA[item];
      }
    });

    setJsonB(newJsonB);

    const jsonString = JSON.stringify(newJsonB, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modified.vil";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((i) => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const convertToC = useCallback(() => {
    if (!jsonC) {
      alert("Please upload Additional VIL file.");
      return;
    }

    const keymap = vial2c(jsonC);

    const blob = new Blob([keymap], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "keymap.c";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  }, [jsonC]);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };


  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h2" gutterBottom style={{textAlign: 'center'}}>
        VIL Tools
      </Typography>
      <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="basic tabs example" centered>
        <Tab label="VIL Copy Items" />
        <Tab label="VIL to Keymap.c" />
      </Tabs>

      {selectedTab === 0 && (
        <StyledPaper elevation={3}>
          <Typography variant="h6" component="h1" gutterBottom>
            Source VIL
          </Typography>
          <TextField
            type="file"
            accept=".vil"
            onChange={handleFileUploadA}
            fullWidth
            margin="normal"
          />
          <Typography variant="h6" component="h1" gutterBottom>
            Target VIL
          </Typography>
          <TextField
            type="file"
            accept=".vil"
            onChange={handleFileUploadB}
            fullWidth
            margin="normal"
          />

          <Typography variant="h6" component="h2" marginTop={3} marginBottom={1}>
            Select Items to Copy:
          </Typography>
          {itemsToDisplay.map(item => (
            <FormControlLabel
              key={item}
              control={
                <Checkbox
                  value={item}
                  checked={selectedItems.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                />
            }
            label={item}
          />
        ))}

        <Button variant="contained" color="primary" onClick={downloadJson} disabled={selectedItems.length === 0}>
          Download Modified VIL
        </Button>
      </StyledPaper>
      )}

      {selectedTab === 1 && (
        <StyledPaper elevation={3}>
          <Typography variant="h6" component="h1" gutterBottom>
            Convert VIL
          </Typography>
          <TextField
            type="file"
            accept=".vil"
            onChange={handleFileUploadC}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={convertToC}>
            Convert to keymap.c
          </Button>
        </StyledPaper>
      )}
    </Container>
  );
}

export default App;
