import { AddRounded, CloseRounded, DeleteRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Sheet,
  Stack,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import DropZone from "components/DropZone";
import NumbericFormatAdapter from "components/NumbericFormatAdapter";
import React from "react";

function SalesInfo({
  variations,
  isAddVariation,
  uploadedFile,
  handleCloseVariation,
  handleRemoveImage,
  onVariationChange,
  onClickAddMoreVariation,
  onClickEnableAddVariation,
  onDrop,
}) {
  return (
    <Stack
      gap={2}
      sx={{
        paddingBlock: "16px",
      }}
    >
      <Typography level="h4" component="h2">
        Sales Information
      </Typography>

      {/* Sales information for each variations */}

      <Stack>
        <Stack
          direction="row"
          gap={3}
          sx={{
            alignItems: isAddVariation ? "flex-start" : "center",
          }}
          width={isAddVariation ? "100%" : "auto"}
        >
          <Typography level="h5" component="h3">
            Variations
          </Typography>
          {isAddVariation ? (
            <Stack width={"100%"} gap={3}>
              {variations?.map((variation, variationIndex) => (
                <Box
                  sx={{
                    "& > *": {
                      marginBottom: "16px",
                    },
                    padding: "24px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                  // maxWidth={600}
                >
                  <IconButton
                    onClick={() => handleCloseVariation(variationIndex)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                    }}
                  >
                    <CloseRounded />
                  </IconButton>
                  <FormControl>
                    <Stack
                      direction="row"
                      gap={2}
                      sx={{
                        alignItems: "center",
                      }}
                      width="50%"
                    >
                      <Tooltip
                        arrow
                        title="Required"
                        placement="top"
                        color="neutral"
                        variant="outlined"
                      >
                        <FormLabel
                          sx={{
                            alignSelf: "center",
                            margin: 0,
                            width: 100,
                          }}
                        >
                          {`Variation ${variationIndex + 1}`}
                          <Typography color="danger">*</Typography>
                        </FormLabel>
                      </Tooltip>

                      <Input
                        placeholder="Please enter. Ex: Red, Blue, Green"
                        type="text"
                        sx={{
                          width: "100%",
                        }}
                        value={variation.name}
                        onChange={(e) => onVariationChange(e, variationIndex)}
                        name="name"
                        required
                      />
                    </Stack>
                  </FormControl>
                </Box>
              ))}

              <Box padding="24px" backgroundColor="#f9f9f9">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onClickAddMoreVariation}
                  startDecorator={<AddRounded />}
                >
                  Add variation
                </Button>
              </Box>
            </Stack>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startDecorator={<AddRounded />}
              onClick={onClickEnableAddVariation}
            >
              Add variation
            </Button>
          )}
        </Stack>

        {isAddVariation ? (
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: "8px",
              marginTop: "16px",
            }}
          >
            <Table
              variant="soft"
              stripe="even"
              borderAxis="bothBetween"
              sx={{
                borderRadius: "8px",
                "& th": {
                  padding: "12px",
                  backgroundColor: "#f9f9f9",
                },
                "& td": {
                  padding: "12px",
                },
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>Variation</th>
                  <th style={{ width: "150px" }}>Price</th>
                  <th style={{ width: "150px" }}>Special Price</th>
                  <th style={{ width: "150px" }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {variations?.map((variation, variationIndex) => (
                  <tr>
                    <td>
                      <Box
                        style={{
                          margin: "0 auto",
                          width: "80px",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="black"
                          marginBottom={1}
                        >
                          {variation.name}
                        </Typography>
                        {variation.image ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <img
                              src={variation.image.preview}
                              alt="variation"
                              style={{ width: "100px", height: "100px", objectFit: "contain" }}
                            />

                            <Button
                              variant="soft"
                              color="neutral"
                              sx={{}}
                              onClick={() =>
                                handleRemoveImage(
                                  variationIndex
                                )
                              }
                            >
                              Remove
                            </Button>
                          </Box>
                        ) : (
                          <DropZone
                            onDrop={(acceptedFiles) => {
                              onDrop(acceptedFiles, variationIndex);
                            }}
                            minHeight={100}
                            maxWidth={80}
                            maxFiles={1}
                            component={
                              <AddRounded
                                color="primary"
                                sx={{
                                  fontSize: 40,
                                }}
                              />
                            }
                          />
                        )}
                      </Box>
                    </td>
                    <td>
                      <Input
                        placeholder="Please input"
                        startDecorator={
                          <Button
                            color="neutral"
                            disabled
                            sx={{
                              color: "black!important",
                              fontWeight: "normal",
                            }}
                          >
                            <Typography variant="caption" color="black">
                              ₫
                            </Typography>
                          </Button>
                        }
                        // type="number"
                        onChange={(e) => onVariationChange(e, variationIndex)}
                        name="price"
                        value={variation.price}
                        slotProps={{
                          input: {
                            component: NumbericFormatAdapter,
                          },
                        }}
                        required
                      />
                    </td>
                    <td>
                      <Input
                        placeholder="Please input"
                        startDecorator={
                          <Button
                            color="neutral"
                            disabled
                            sx={{
                              color: "black!important",
                              fontWeight: "normal",
                            }}
                          >
                            <Typography variant="caption" color="black">
                              ₫
                            </Typography>
                          </Button>
                        }
                        // type="number"
                        onChange={(e) => onVariationChange(e, variationIndex)}
                        name="special_price"
                        value={variation.special_price}
                        slotProps={{
                          input: {
                            component: NumbericFormatAdapter,
                          },
                        }}
                        required
                      />
                    </td>
                    <td>
                      <Input
                        placeholder="Enter stock"
                        type="number"
                        value={variation.stock}
                        onChange={(e) => onVariationChange(e, variationIndex)}
                        name="stock"
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        ) : (
          <Stack direction="row" gap={2} marginTop={2}>
            <FormControl>
              <Tooltip arrow title="Required" placement="top" color="neutral" variant="outlined">
                <FormLabel>
                  Price
                  <Typography color="danger">*</Typography>
                </FormLabel>
              </Tooltip>
              <Input
                placeholder="Enter price"
                startDecorator={
                  <Button
                    color="neutral"
                    disabled
                    sx={{
                      color: "black!important",
                      fontWeight: "normal",
                    }}
                  >
                    <Typography variant="caption" color="black">
                      ₫
                    </Typography>
                  </Button>
                }
                // type="number"
                name="price"
                value={variations[0]?.price}
                required
                onChange={(e) => onVariationChange(e, 0)}
                slotProps={{
                  input: {
                    component: NumbericFormatAdapter,
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <Tooltip arrow title="Required" placement="top" color="neutral" variant="outlined">
                <FormLabel>
                  Special Price
                  <Typography color="danger">*</Typography>
                </FormLabel>
              </Tooltip>
              <Input
                placeholder="Enter price"
                startDecorator={
                  <Button
                    color="neutral"
                    disabled
                    sx={{
                      color: "black!important",
                      fontWeight: "normal",
                    }}
                  >
                    <Typography variant="caption" color="black">
                      ₫
                    </Typography>
                  </Button>
                }
                // type="number"
                name="special_price"
                value={variations[0]?.special_price}
                required
                onChange={(e) => onVariationChange(e, 0)}
                slotProps={{
                  input: {
                    component: NumbericFormatAdapter,
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <Tooltip arrow title="Required" placement="top" color="neutral" variant="outlined">
                <FormLabel>
                  Stock
                  <Typography color="danger">*</Typography>
                </FormLabel>
              </Tooltip>
              <Input
                placeholder="Enter stock"
                type="number"
                value={variations[0]?.stock}
                name="stock"
                onChange={(e) => onVariationChange(e, 0)}
                required
              />
            </FormControl>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default SalesInfo;
