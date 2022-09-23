import React from "react";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { PaginationItem, Pagination } from "@mui/material";

import useStyles from "@src/components/shared/layout/customPagination/Styles";

interface CustomPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const CustomPagination = ({ count, page, onChange }: CustomPaginationProps) => {
  const classes = useStyles();
  return (
    <Pagination
      className={classes.paginationStyles}
      defaultPage={1}
      page={page}
      count={count}
      onChange={onChange}
      size="large"
      renderItem={(item) => (
        <PaginationItem
          components={{
            previous: ArrowLeftIcon,
            next: ArrowRightIcon,
          }}
          {...item}
        />
      )}
    />
  );
};

export default CustomPagination;
