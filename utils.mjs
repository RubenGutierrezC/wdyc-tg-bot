export const getChatIndex = (chats = [], chatId) => {
  return chats.findIndex((c) => c.chatId === chatId);
};
