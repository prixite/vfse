import { Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 230 },
  { field: "is_default", headerName: "Default?", width: 230 },
];

export default function Organization() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/organizations/")
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
        setIsLoaded(true);
      });
  }, []);

  return (
    <Fragment>
      <h2>3rd Party Administration</h2>
      {!isLoaded && <div>Loading</div>}
      {isLoaded && (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={items}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </div>
      )}
    </Fragment>
  );
}
