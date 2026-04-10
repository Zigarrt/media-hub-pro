import { MediaFile } from "./types";

const now = new Date();
const day = 24 * 60 * 60 * 1000;

export const MOCK_FOLDERS = ["reklame", "promocije", "informacije", "ozadja"];

export const MOCK_FILES: MediaFile[] = [
  {
    id: "1",
    name: "poletna-akcija.jpg",
    folder: "reklame",
    path: "reklame/poletna-akcija.jpg",
    type: "image",
    size: 2457600,
    uploadedAt: new Date(now.getTime() - 5 * day),
    expiresAt: new Date(now.getTime() + 25 * day),
    duration: 30,
  },
  {
    id: "2",
    name: "promo-video.mp4",
    folder: "promocije",
    path: "promocije/promo-video.mp4",
    type: "video",
    size: 15728640,
    uploadedAt: new Date(now.getTime() - 12 * day),
    expiresAt: new Date(now.getTime() + 2 * day),
    duration: 14,
  },
  {
    id: "3",
    name: "delovni-cas.png",
    folder: "informacije",
    path: "informacije/delovni-cas.png",
    type: "image",
    size: 512000,
    uploadedAt: new Date(now.getTime() - 8 * day),
    expiresAt: new Date(now.getTime() - 1 * day),
    duration: 7,
  },
  {
    id: "4",
    name: "ozadje-zima.jpg",
    folder: "ozadja",
    path: "ozadja/ozadje-zima.jpg",
    type: "image",
    size: 3145728,
    uploadedAt: new Date(now.getTime() - 2 * day),
    expiresAt: new Date(now.getTime() + 28 * day),
    duration: 30,
  },
  {
    id: "5",
    name: "novo-leto.mp4",
    folder: "promocije",
    path: "promocije/novo-leto.mp4",
    type: "video",
    size: 20971520,
    uploadedAt: new Date(now.getTime() - 6 * day),
    expiresAt: new Date(now.getTime() + 1 * day),
    duration: 7,
  },
  {
    id: "6",
    name: "cenik-2024.png",
    folder: "informacije",
    path: "informacije/cenik-2024.png",
    type: "image",
    size: 819200,
    uploadedAt: new Date(now.getTime() - 1 * day),
    expiresAt: new Date(now.getTime() + 29 * day),
    duration: 30,
  },
];
