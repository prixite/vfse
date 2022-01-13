import { useEffect, useState } from "react";

import DoneIcon from "@mui/icons-material/Done";
import { OutlinedInput, MenuItem, FormControl, Select } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
  tableColumns: {
    field: string;
    headerName: string;
    width: number;
    hide: boolean;
    disableColumnMenu: boolean;
  }[];
  setTableColumns: (
    arg: {
      field: string;
      headerName: string;
      width: number;
      hide: boolean;
      disableColumnMenu: boolean;
    }[]
  ) => void;
}

const ColumnSelector = ({ tableColumns, setTableColumns }: Props) => {
  const [columnList, setColumnList] = useState(() => {
    let options = [];
    tableColumns.map((column) => (options = [...options, column.headerName]));
    return options;
  });

  useEffect(() => {
    const c = tableColumns.map((column) => {
      if (columnList.includes(column.headerName)) {
        column.hide = false;
      } else {
        column.hide = true;
      }
      return column;
    });
    setTableColumns(c);
  }, [columnList]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setColumnList(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl
      sx={{ width: 300, height: 40, margin: "1px", marginRight: "8px" }}
    >
      <Select
        multiple
        displayEmpty
        style={{ height: "41px", background: "#ffffff" }}
        value={columnList}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          return (
            <span style={{ display: "inline-block", paddingTop: "3px" }}>
              columns {`${selected.length}/${tableColumns.length}`}{" "}
            </span>
          );
        }}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
      >
        {tableColumns.map((column) => (
          <MenuItem key={column.headerName} value={column.headerName}>
            <div
              style={{
                width: "-webkit-fill-available",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span> {column.headerName} </span>
              {columnList.includes(column.headerName) ? <DoneIcon /> : ""}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ColumnSelector;
