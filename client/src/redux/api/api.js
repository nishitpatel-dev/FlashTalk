import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/`,
  }),
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => ({
        url: "chat/mychats",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    searchUser: builder.query({
      query: (searchTerm) => ({
        url: `user/search?name=${searchTerm}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    sendFriendRequest: builder.mutation({
      query: (id) => ({
        url: "user/sendrequest",
        method: "PUT",
        credentials: "include",
        body: id,
      }),
      invalidatesTags: ["User"],
    }),

    getNotifications: builder.query({
      query: () => ({
        url: "user/notifications",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    getMyMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    getMyGroups: builder.query({
      query: () => ({
        url: "chat/mygroups",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/friends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    newGroup: builder.mutation({
      query: ({ chatName, members }) => ({
        url: "chat/newgroup",
        method: "POST",
        credentials: "include",
        body: { chatName, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),

    removeGroupMembers: builder.mutation({
      query: ({ userId, chatId }) => ({
        url: `chat/mygroups/removemembers`,
        method: "PUT",
        credentials: "include",
        body: { userId, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),

    addGroupMembers: builder.mutation({
      query: ({ chatId, members }) => ({
        url: `chat/mygroups/addmembers`,
        method: "PUT",
        credentials: "include",
        body: { chatId, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: ({ id }) => ({
        url: `chat/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMyMessagesQuery,
  useSendAttachmentsMutation,
  useGetMyGroupsQuery,
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMembersMutation,
  useAddGroupMembersMutation,
  useDeleteChatMutation,
} = api;
export { api };
