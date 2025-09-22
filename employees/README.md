# Sirma Solutions Interview Task

- navigate to employees folder.
- run `npm install`.
- run `npm run dev`.

- Example data use while development is inside `test-data` folder.
- `modelsbuilder.service` is where the employee pair is being found.
- `timeperiod.service` is where the date parsing and comparison is happeing. Used `luxon` package for parising dates and comparing.
- `CsvUploader` component is where the UI is handling the csv file upload
- Used DI Context for providing services to application, which is bootstraped in main.tsx
