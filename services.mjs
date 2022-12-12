import axios from "axios";
import { BASE_URL } from "./config.mjs";

const http = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const upload = async ({ type, content, uploadMode, uploadedBy }) => {
  await http.post(`pending-to-aprove/upload`, {
    type,
    content,
    uploadMode,
    uploadedBy,
  });
};
