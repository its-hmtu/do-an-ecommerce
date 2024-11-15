import { AddRounded } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import DropZone from "components/DropZone";
import PreviewTable from "components/PreviewTable";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function BasicInfo({
  data,
  categories,
  brands,
  isImagePreview,
  upload,
  progress,
  uploadedFiles,
  coverImageCount,
  filesCount,
  onDrop,
  handleRemoveImage,
  handleOnChange,
  handleOnCategoryChange,
  focusRef
}) {
  return (
    <Stack
      gap={2}
      sx={{
        paddingBottom: "16px",
      }}
    >
      <Typography level="h4" component="h2">
        Basic Information
      </Typography>
      <FormControl>
        <Tooltip arrow title="Required" placement="top" color="neutral" variant="outlined">
          <FormLabel>
            Name
            <Typography color="danger">*</Typography>
          </FormLabel>
        </Tooltip>
        <Input
          placeholder="Please enter"
          required
          name="name"
          value={data.name}
          onChange={(e) => handleOnChange(e)}
        />
      </FormControl>
      <FormControl sx={{
        height: "400px"
      }}>
        <Tooltip arrow title="Required" placement="top" color="neutral" variant="outlined">
          <FormLabel>
            Description
            <Typography color="danger">*</Typography>
          </FormLabel>
        </Tooltip>
        {/* <Textarea
          placeholder="Enter enter"
          minRows={3}
          name="description"
          value={data.description}
          onChange={(e) => handleOnChange(e)}
        /> */}
        <ReactQuill
        style={{
          "ql-container": {
            height: "100%"
          }
        }} 
          theme="snow" 
          value={data.description}
          onChange={(value) => handleOnChange({target: {name: "description", value}})}
          ref={focusRef}
        />
      </FormControl>
      <Stack
        direction="row"
        gap={2}
        width="50%"
        sx={{
          "& > *": {
            width: "50%",
          },
        }}
      >
        <FormControl>
          <Tooltip arrow title="Required" placement="top" color="neutral" variant="outlined">
            <FormLabel>
              Category
              <Typography color="danger">*</Typography>
            </FormLabel>
          </Tooltip>
          <Select
            placeholder="Please select"
            sx={{
              // width: "25%",
              maxHeight: "200px",
            }}
            name="category"
            value={data.category}
            onChange={(e, newValue) =>
              handleOnCategoryChange(newValue, "category")
            }
          >
            <Stack>
              {categories?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Stack>
            <Button
              variant="plain"
              color="primary"
              endDecorator={<AddRounded />}
              sx={{
                textAlign: "left",
              }}
            >
              Add new category
            </Button>
          </Select>
        </FormControl>
      </Stack>
      <FormControl>
        <Tooltip
          arrow
          title="Required - Select at least 1 image"
          placement="top"
          color="neutral"
          variant="outlined"
        >
          <FormLabel>
            Product images
            <Typography color="danger">*</Typography>
          </FormLabel>
        </Tooltip>
        <DropZone
          onDrop={onDrop}
          maxWidth={"25%"}
          filesCount={filesCount}
          maxFiles={6}
        />
      </FormControl>
      {isImagePreview && (
        <PreviewTable
          upload={upload}
          progress={progress}
          handleRemoveImage={(id) => handleRemoveImage(id)}
          uploadedFiles={uploadedFiles}
        />
      )}
      <FormControl>
        <Tooltip arrow title="Required" placement="top" color="neutral" variant="outlined">
          <FormLabel>
            Cover image
            <Typography color="danger">*</Typography>
          </FormLabel>
        </Tooltip>
        {isImagePreview ? (
          upload.isPending ? (
            <CircularProgress />
          ) : (
            <img
              src={`${process.env.REACT_APP_API_URL}${uploadedFiles[0].file_path}`}
              alt={uploadedFiles[0].original_name}
              style={{ width: "100px" }}
            />
          )
        ) : (
          <DropZone
            onDrop={onDrop}
            maxWidth={"100px"}
            minHeight={"100px"}
            filesCount={0}
            maxFiles={1}
            disabled
            component={
              <>
                <AddRounded
                  color="primary"
                  sx={{
                    fontSize: 40,
                  }}
                />
                <span>0 / 1</span>
              </>
            }
          />
        )}
      </FormControl>
    </Stack>
  );
}

export default BasicInfo;
