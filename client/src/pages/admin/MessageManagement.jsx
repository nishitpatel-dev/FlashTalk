import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";
import { useGetAllMessageForAdminQuery } from "../../redux/api/api";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0 ? (
        attachments.map((i) => {
          const url = i.url;
          const file = fileFormat(url);

          // console.log(url, file);

          return (
            <Box key={i.public_id} margin={"25px 0"}>
              <a href={url} target="_blank" style={{ color: "black" }} download>
                {<RenderAttachment url={url} file={file} />}
              </a>
            </Box>
          );
        })
      ) : (
        <span>No Attachments</span>
      );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chatId",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "isGroupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState([]);
  const { data, isError, error, isLoading } = useGetAllMessageForAdminQuery("");

  useErrors([
    {
      isError,
      error,
    },
  ]);

  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);

  return isLoading ? (
    <Skeleton height={"100vh"} />
  ) : (
    <Table
      heading={"All Messages"}
      columns={columns}
      rows={rows}
      rowHeight={200}
    />
  );
};

export default AdminLayout(MessageManagement);
