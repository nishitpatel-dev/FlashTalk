export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Nishit Patel",
    _id: "2",
    groupChat: false,
    members: ["1", "2", "3"],
  },
  {
    avatar: [
      "https://www.w3schools.com/howto/img_avatar.png",
      "https://www.w3schools.com/howto/img_avatar.png",
      "https://www.w3schools.com/howto/img_avatar.png",
    ],
    name: "Kavy Patel",
    _id: "3",
    groupChat: false,
    members: ["1"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Nishit Patel",
    _id: "2",
  },
  {
    avatar: [
      "https://www.w3schools.com/howto/img_avatar.png",
      "https://www.w3schools.com/howto/img_avatar.png",
    ],
    name: "Kavy Patel",
    _id: "3",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "John Doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "Nishit Patel",
    },
    _id: "2",
  },
  {
    sender: {
      avatar: [
        "https://www.w3schools.com/howto/img_avatar.png",
        "https://www.w3schools.com/howto/img_avatar.png",
      ],
      name: "Kavy Patel",
    },
    _id: "3",
  },
];

export const sampleMessage = [
  {
    attachments: [
      // {
      //   public_id: "abc",
      //   url: "https://www.w3schools.com/howto/img_avatar.png",
      // },
    ],
    content: "Kya be Gan*u?",
    _id: "xyz",
    sender: {
      _id: "user._id",
      name: "Kavy",
    },
    chat: "chatId",
    createdAt: "2024-07-16T11:04:49.833Z",
  },
  {
    attachments: [
      {
        public_id: "abc 2",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "",
    _id: "xyz 2",
    sender: {
      _id: "user._id 2",
      name: "Kavy 2",
    },
    chat: "chatId 2",
    createdAt: "2024-07-16T11:04:49.833Z",
  },
];
