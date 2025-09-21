import React, { useEffect, useState } from "react";
import { useServices } from "../di/AppServices";

export const CsvUploader: React.FC = () => {
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>("");
  const { modelsBuilderService } = useServices();

  useEffect(() => {
    if (data.length > 0) {
      console.log("Parsed CSV Data:", data);
      modelsBuilderService?.buildModels(data);
    }
  }, [data]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        return;
      }

      const rows = text
        .trim()
        .split("\n")
        .map((row) => row.trim())
        .filter((row) => row.length > 0)
        .map((cell) => cell.split(","));

      setData(rows);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input type='file' accept='.csv' onChange={handleFileUpload} />
      {fileName && <p>Uploaded file: {fileName}</p>}
    </>
  );
};
