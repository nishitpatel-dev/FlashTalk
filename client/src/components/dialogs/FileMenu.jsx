import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  Image as ImageIcon,
  AudioFile as AudioIcon,
  VideoFile as VideoIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorEl, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const [sendAttchments] = useSendAttachmentsMutation();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    dispatch(setIsFileMenu(false));

    try {
      const formData = new FormData();

      formData.append("chatId", chatId);
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await sendAttchments(formData);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error("Failed to send", { id: toastId });
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <>
      <Menu
        open={isFileMenu}
        anchorEl={anchorEl}
        onClose={() => {
          dispatch(setIsFileMenu(false));
        }}
      >
        <div style={{ width: "10rem" }}>
          <MenuList>
            <MenuItem
              onClick={() => {
                imageRef.current.click();
              }}
            >
              <ImageIcon />
              <ListItemText style={{ marginLeft: "0.5rem" }}>
                Image
              </ListItemText>
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  fileChangeHandler(e, "Images");
                }}
                ref={imageRef}
              />
            </MenuItem>

            <MenuItem
              onClick={() => {
                audioRef.current.click();
              }}
            >
              <AudioIcon />
              <ListItemText style={{ marginLeft: "0.5rem" }}>
                Audio
              </ListItemText>
              <input
                type="file"
                multiple
                accept="audio/mpeg, audio/wav"
                style={{ display: "none" }}
                onChange={(e) => {
                  fileChangeHandler(e, "Audios");
                }}
                ref={audioRef}
              />
            </MenuItem>

            <MenuItem
              onClick={() => {
                videoRef.current.click();
              }}
            >
              <VideoIcon />
              <ListItemText style={{ marginLeft: "0.5rem" }}>
                Video
              </ListItemText>
              <input
                type="file"
                multiple
                accept="video/mp4, video/ogg, video/webm"
                style={{ display: "none" }}
                onChange={(e) => {
                  fileChangeHandler(e, "Videos");
                }}
                ref={videoRef}
              />
            </MenuItem>

            <MenuItem
              onClick={() => {
                fileRef.current.click();
              }}
            >
              <UploadFileIcon />
              <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
              <input
                type="file"
                multiple
                accept="*"
                style={{ display: "none" }}
                onChange={(e) => {
                  fileChangeHandler(e, "Files");
                }}
                ref={fileRef}
              />
            </MenuItem>
          </MenuList>
        </div>
      </Menu>
    </>
  );
};

export default FileMenu;
