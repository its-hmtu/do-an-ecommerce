import React from "react";
import { Stack, Typography, Table, Button } from "@mui/joy";
import SpecificationDetailModal from "components/Modal/SpecificationDetailModal";

function SpecificationCard({data}) {
  const [openDetail, setOpenDetail] = React.useState(false);
  return (
    <>
    <Stack
      sx={{
        border: "1px solid #cdd7e1",
        padding: "16px",
        borderRadius: "6px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "338px",
        maxHeight: "750px",
      }}
    >
      <Typography level="title-md">Specifications</Typography>
      <Stack
        gap={2}
        sx={{
          marginTop: "16px",
        }}
      >
        <Table>
          <tbody>
            {data?.specification &&
              Object.keys(data?.specification)
                .slice(0, 15)
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
        <Button 
          onClick={() => setOpenDetail(true)}
        >View more</Button>
      </Stack>
    </Stack>

    {
      openDetail && <SpecificationDetailModal 
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        data={data}
      />
    }
    </>
    
  );
}

export default SpecificationCard;
