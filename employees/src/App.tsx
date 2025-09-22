import "./App.css";
import { Container, Typography } from "@mui/material";
import { CsvUploader } from "./components/CsvUploader";

function App() {
  return (
    <>
      <Container maxWidth='md' sx={{ mt: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Employee Pair Work Time Tracker
        </Typography>
        <CsvUploader />
      </Container>
    </>
  );
}

export default App;
