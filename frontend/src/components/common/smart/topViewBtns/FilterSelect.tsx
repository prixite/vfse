import React, { useState, useEffect } from 'react';
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

function FilterSelect({ label, id, data, selected, handleClick, t, navigate, queryParams }) {
    const dropdownStyles = {
        PaperProps: {
          style: {
            maxHeight: 300,
            width: 220,
          },
        },
      };
  return (
    <FormControl
      sx={{
        m: 0,
        mr: 1,
        maxWidth: "30%",
        minWidth: "26%",
        background: "#ffffff",
      }}
    >
      <InputLabel id={`${id}InputLabel`} style={{ marginTop: "-3px" }}>
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-dropdown`}
        id={id}
        value={selected || ''} // Set the selected value as the value
        style={{ width: "100%", height: "100%" }}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected}
        MenuProps={dropdownStyles}
      >
        <MenuItem style={{ display: "none" }} value="">
          <ListItemText primary={``} />
        </MenuItem>
        {data?.map((item, index) => (
          <MenuItem
            key={index}
            value={item.name}
            onClick={(event) => handleClick(event, item, id)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={selected === item.name}
                onClick={(event) => handleClick(event, item, id)}
              />
              <label htmlFor={`checkbox-${id}-${index}`}>
                <ListItemText primary={item.name} />
              </label>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FilterSelect;
