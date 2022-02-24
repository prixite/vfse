import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { localizedData } from "@src/helpers/utils/language";

import "@src/components/common/Presentational/LastActiveUserCell/LastActiveUserCell.scss";

const { name, healthNetwork, status } = localizedData().Faq;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  borderBottom: "none",
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.action.hover,
    color: "#6B7280",
    fontFamily: "Inter",
    fontSize: "12px",
    lineHeight: "16px",
    fontStyle: "normal",
    fontWeight: "500",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  borderBottom: "none",
}));
const StyledTableFirstCell = styled(TableCell)(() => ({
  fontFamily: "ProximaNova-Regular",
  fontSize: "14px",
  lineHeight: "20px",
  fontStyle: "normal",
  fontWeight: "600",
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  borderBottom: "none",
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
  createData("EclairP", "Joa", "Locked"),
  createData("Ccake", "Loa", "Active"),
  createData("Fbread", "Koa", "Locked"),
];

export default function LastActiveUserCell() {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead className="cell_class">
          <TableRow>
            <StyledTableHeadCell>{name}</StyledTableHeadCell>
            <StyledTableHeadCell align="center">
              {healthNetwork}
            </StyledTableHeadCell>
            <StyledTableHeadCell align="right">{status}</StyledTableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableFirstCell scope="row">
                {row.name}
              </StyledTableFirstCell>
              <StyledTableCell align="center">{row.network}</StyledTableCell>
              <StyledTableCell
                align="right"
                className={
                  row.status === "Locked" ? "text-success" : "text-warning"
                }
              >
                {row.status}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
