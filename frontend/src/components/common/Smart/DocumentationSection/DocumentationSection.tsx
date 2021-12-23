import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditLogo from "@src/assets/svgs/Edit.svg";
import LinkLogo from "@src/assets/svgs/Link.svg";
import "@src/components/common/Smart/DocumentationSection/DocumentationSection.scss";
import TopTableFilters from "../TopTableFilters/TopTableFilters";
import { localizedData } from "@src/helpers/utils/language";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
    borderBottom: "1px solid #E5E7EB",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: string,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Ge signa excite", "Phillips", 6.0, 24, 4.0),
  createData("Ge signa excite", "Phillips", 9.0, 37, 4.3),
  createData("Ge signa excite", "Phillips", 16.0, 24, 6.0),
  createData("Ge signa excite", "Phillips", 3.7, 67, 4.3),
  createData("Ge signa excite", "Phillips", 16.0, 49, 3.9),
];

export default function DocumentationSection() {
  let constantData: any;
  constantData = localizedData()?.documentation;
  const { title } = constantData;

  const renderModalities = (modalities) => {
    return (
      <div className="modality-section">
        {modalities.map((modality) => (
          <span className="modality">{modality}</span>
        ))}
      </div>
    );
  };

  const documentationLink = (link) => {
    return (
      <div className="documentaion-link">
        <img className="img" src={LinkLogo} />
        <span>{link}</span>
      </div>
    );
  };

  const actionLink = () => {
    return (
      <div>
        <img src={EditLogo} />
      </div>
    );
  };
  return (
    <div className="documentaion-section">
      <h2>{title}</h2>
      <TopTableFilters />
      <TableContainer component={Paper} style={{ marginTop: "30px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>SYSTEM NAME</StyledTableCell>
              <StyledTableCell align="right">MANUFACTURER</StyledTableCell>
              <StyledTableCell align="right">MODALITY</StyledTableCell>
              <StyledTableCell align="right">
                DOCUMENTATION LINK
              </StyledTableCell>
              <StyledTableCell align="right">ACTION</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>
                  <span className="dark-text">{row.name}</span>
                </StyledTableCell>
                <StyledTableCell align="right">{row.calories}</StyledTableCell>
                <StyledTableCell align="right">
                  {renderModalities(["MRI", "CRM", "MRI-2"])}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {documentationLink("www.doclink.com/ertghjhas/systemname")}
                </StyledTableCell>
                <StyledTableCell align="right">{actionLink()}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
