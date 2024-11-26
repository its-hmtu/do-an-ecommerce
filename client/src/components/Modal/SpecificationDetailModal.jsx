import React from 'react'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  ModalClose,
  Table,
  Typography,

} from "@mui/joy";

function SpecificationDetailModal({
  open,
  onCancel,
  onConfirm,
  title,
  color,
  confirmText,
  cancelText,
  data
}) {
  return (
    <Modal onClose={onCancel} open={open} sx={{}}>
      <ModalDialog variant="outlined" role="alertdialog">
        <ModalClose />
        <DialogTitle>
          Detail Specifications
        </DialogTitle>
        <Divider />
        <DialogContent>
        <Table>
          <tbody>
            {data?.specification &&
              Object.keys(data?.specification)
                .map((key) => (
                  <tr key={key}>
                    <td>
                      <Typography level="body-sm">
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-sm">
                        {key === "manufacture_date"
                          ? data?.specification[key].split("T")[0]
                          : data?.specification[key] || "N/A"}
                      </Typography>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
        </DialogContent>
      </ModalDialog>
    </Modal>
  )
}

export default SpecificationDetailModal