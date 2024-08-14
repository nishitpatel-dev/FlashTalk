export const getSockets = (members = []) => {
  const sockets = members.map((member) => userScoketIDs.get(member._id.toString()));
  return sockets;
};

export const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
