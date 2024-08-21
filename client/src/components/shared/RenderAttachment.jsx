import { FileOpen as FileOpenIcon } from "@mui/icons-material";
import React from "react";
import { transformImage } from "../../lib/features";

const RenderAttachment = ({ url, file }) => {
  switch (file) {
    case "video":
      return <video src={url} width={"200px"} controls preload="metadata" />;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          width={"200px"}
          height={"150px"}
          style={{ objectFit: "contain" }}
          alt="Attachment"
        />
      );

    case "audio":
      return <audio src={url} preload="metadata" controls />;

    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachment;
