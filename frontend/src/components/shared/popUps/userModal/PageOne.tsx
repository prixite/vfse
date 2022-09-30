import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import NumberIcon from "@src/assets/svgs/number.svg";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import { localizedData } from "@src/helpers/utils/language";
import {
  Organization,
  Role,
  useOrganizationsUsersListQuery,
} from "@src/store/reducers/generated";
import { Formik } from "@src/types/interfaces";

interface Props {
  formik: Formik;
  selectedImage: File[];
  setSelectedImage: React.Dispatch<React.SetStateAction<[]>>;
  roles: Array<Role>;
  isPhoneError: string;
  organizationData: Array<Organization>;
  action: string;
}

const PageOne = ({
  formik,
  selectedImage,
  setSelectedImage,
  roles,
  isPhoneError,
  organizationData,
  action,
}: Props) => {
  const { data: managers = [] } = useOrganizationsUsersListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );

  const constantUserData = localizedData().users.popUp;

  return (
    <>
      <div>
        <p className="info-label required">
          {constantUserData.profileImageText}
        </p>
        <DropzoneBox
          imgSrc={formik.values.userProfileImage}
          setSelectedImage={setSelectedImage}
          selectedImage={selectedImage}
        />
        {
          <p className="errorText" style={{ marginTop: "5px" }}>
            {formik.errors.userProfileImage}
          </p>
        }
      </div>
      <div>
        <p className="info-label required">{constantUserData.userFirstName}</p>
        <TextField
          autoComplete="off"
          name="firstname"
          className="full-field"
          value={formik.values.firstname}
          type="text"
          onChange={formik.handleChange}
          variant="outlined"
          placeholder="First Name"
        />
        <p className="errorText" style={{ marginTop: "5px" }}>
          {formik.errors.firstname}
        </p>
      </div>
      <div>
        <p className="info-label required">{constantUserData.userLastName}</p>
        <TextField
          autoComplete="off"
          name="lastname"
          className="full-field"
          type="text"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          variant="outlined"
          placeholder="Last Name"
        />
        <p className="errorText" style={{ marginTop: "5px" }}>
          {formik.errors.lastname}
        </p>
      </div>
      <div className="divided-div">
        <div>
          <p className="info-label required">{constantUserData.userEmail}</p>
          <TextField
            autoComplete="off"
            name="email"
            className="info-field"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            variant="outlined"
            placeholder="Email"
          />
          <p className="errorText" style={{ marginTop: "5px" }}>
            {formik.errors.email}
          </p>
        </div>
        <div>
          <p className="info-label required">
            {constantUserData.userPhoneNumber}
          </p>
          <TextField
            autoComplete="off"
            name="phone"
            className="info-field"
            variant="outlined"
            value={formik.values.phone}
            type="number"
            onChange={formik.handleChange}
            placeholder="1234567890"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={NumberIcon} alt="" />
                </InputAdornment>
              ),
            }}
          />
          <p className="errorText" style={{ marginTop: "5px" }}>
            {isPhoneError}
          </p>
        </div>
      </div>
      <div className="divided-div">
        <div>
          <p className="info-label">{constantUserData.userRole}</p>
          <FormControl sx={{ minWidth: 356 }}>
            <Select
              name="role"
              value={formik.values.role}
              inputProps={{ "aria-label": "Without label" }}
              style={{ height: "43px", borderRadius: "8px" }}
              onChange={formik.handleChange}
              disabled={!roles.length}
              MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
              defaultValue="none"
            >
              {roles.map((item, key) => (
                <MenuItem key={key} value={item.value}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <p className="info-label">{constantUserData.userManager}</p>
          <FormControl sx={{ minWidth: 356 }}>
            <Select
              name="manager"
              value={formik.values.manager}
              inputProps={{ "aria-label": "Without label" }}
              style={{
                height: "43px",
                borderRadius: "8px",
                color: formik.values.manager == -1 ? "darkgray" : "",
              }}
              onChange={formik.handleChange}
              MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
              disabled={!managers.length}
            >
              {managers.map((item, key) => (
                <MenuItem
                  key={key}
                  value={item.id}
                  style={{ color: item.id == -1 ? "darkgray" : "" }}
                >
                  {item.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div>
        <p className="info-label">{constantUserData.userCustomer}</p>
        <FormControl sx={{ width: "100%" }}>
          <Select
            name="customer"
            value={formik.values.customer}
            disabled={action == "edit"}
            inputProps={{ "aria-label": "Without label" }}
            style={{ height: "43px", borderRadius: "8px" }}
            onChange={formik.handleChange}
            MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
          >
            {organizationData.map((item, key) => (
              <MenuItem key={key} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default PageOne;
