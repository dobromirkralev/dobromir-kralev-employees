import "./App.css";
import { CsvUploader } from "./components/CsvUploader";

function App() {
  return (
    <>
      <div className='file-upload-container'>
        <CsvUploader />
      </div>
    </>
  );
}

export default App;
