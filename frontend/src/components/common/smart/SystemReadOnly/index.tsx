import React, { useState } from "react";

import { FormControlLabel, Switch } from "@mui/material";

interface Props {
  systemStatus: Map<number, { system: number; is_read_only: boolean }>;
  system: number;
  handleReadOnly: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    system: number
  ) => void;
}

export default function SystemReadOnly({
  handleReadOnly,
  system,
  systemStatus,
}: Props) {
  const [isReadOnly, setIsReadOnly] = useState(false);
  React.useEffect(() => {
    setIsReadOnly(systemStatus.get(system)?.is_read_only ?? false);
  }, [systemStatus.get(system)]);
  return (
    <FormControlLabel
      control={
        <Switch
          onClick={(e) => handleReadOnly(e, system)}
          checked={isReadOnly}
        />
      }
      label="Read Only"
    />
  );
}
