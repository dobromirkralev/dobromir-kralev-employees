import React, { useEffect, useState } from "react";
import { useServices } from "../di/AppServices";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const CsvUploader: React.FC = () => {
  const [data, setData] = useState<string[][]>([]);
  const [topPair, setTopPair] = useState<{
    empA: string;
    empB: string;
    totalTime: number;
    projects: string[];
  }>();
  const [commonProjects, setCommonProjects] = useState<
    {
      empA: string;
      empB: string;
      projectId: string;
      daysTogther: number;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const { modelsBuilderService } = useServices();

  useEffect(() => {
    if (data.length > 0 && modelsBuilderService) {
      modelsBuilderService.buildModels(data);
      const topPair = modelsBuilderService.findTopPair();
      setTopPair(topPair ?? undefined);
      if (topPair) {
        setCommonProjects(
          modelsBuilderService.listTopPairsProjects(topPair) ?? []
        );
      }
      setLoading(false);
    }
  }, [data, modelsBuilderService]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setTopPair(undefined);
    setCommonProjects([]);
    setData([]);
    setLoading(true);
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setLoading(false);
        return;
      }

      const rows = text
        .trim()
        .split("\n")
        .map((row) => row.trim())
        .filter((row) => row.length > 0)
        .map((cell) => cell.split(","));

      setData(rows);
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Box>
        <Button variant='contained' component='label'>
          Upload CSV
          <input
            style={{ visibility: "hidden", width: 0, height: 0 }}
            type='file'
            accept='.csv'
            onChange={handleFileUpload}
          />
        </Button>
        {fileName && <p>Uploaded file: {fileName}</p>}
      </Box>

      <Box mt={4}>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' p={4}>
            <CircularProgress />
          </Box>
        ) : commonProjects.length > 0 ? (
          <Box mb={2}>
            <p>
              Top Employee Pair: {topPair?.empA} & {topPair?.empB} - Total Days{" "}
              {topPair?.totalTime}
            </p>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee A</TableCell>
                    <TableCell>Employee B</TableCell>
                    <TableCell>Project ID</TableCell>
                    <TableCell>Days Together</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commonProjects.map((commonProject, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Object.keys(commonProject).map(
                        (
                          prop: string,
                          propIndex: React.Key | null | undefined
                        ) => (
                          <TableCell key={propIndex}>
                            {commonProject[prop as keyof typeof commonProject]}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <p>No data to display. Please upload a CSV file.</p>
        )}
      </Box>
    </>
  );
};
