import { MoreHorizRounded } from '@mui/icons-material';
import { Divider, Dropdown, IconButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import React from 'react'

function RowMenu({ onEdit, onDelete, onRename }) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRounded />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={onEdit}>Edit</MenuItem>
        <MenuItem onClick={onRename}>Rename</MenuItem>
        {/* <MenuItem>Move</MenuItem> */}
        <Divider />
        <MenuItem color="danger" onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default RowMenu