import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import theme from "@src/theme";
import "@src/components/common/Presentational/LastActiveUserCell/LastActiveUserCell.scss";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, network, status) {
  return { name, network, status };
}

const rows = [
  createData("Frozen yoghurt", "Advent", "Active"),
  createData("Ice cream sandwich", "Nova", "Locked"),
  createData("Eclair", "Ova", "Active"),
  createData("Cupcake", "Fova", "Locked"),
  createData("Gingerbread", "Poa", "Active"),
  createData("Eclair", "Joa", "Locked"),
  createData("Cupcake", "Loa", "Active"),
  createData("Gingerbread", "Koa", "Locked"),
];

export default function LastActiveUserCell() {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 457 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead
          className="cell_class"
          style={{
            color: "black",
            backgroundColor: theme.palette.common.black,
          }}
        >
          <TableRow>
            <TableCell>NAME</TableCell>
            <TableCell align="center">HEALTH NETWORK</TableCell>
            <TableCell align="right">STATUS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ overflow: "auto" }}>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="center">{row.network}</StyledTableCell>
              <StyledTableCell align="right">{row.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
