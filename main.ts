// Entry program for make.fun's "Bring the humans with a TikTok ad" bounty.
//
// The entry itself is the TikTok video; this repository only has to hand its
// address to the grader. VIDEO.json at the repository root names the video,
// and this program copies that file, byte for byte, into the output
// directory the grader points at. It reads nothing else, writes nothing
// else, and prints nothing on success, so two runs always agree.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// The grader sets MAKEFUN_BOT_DIR to the repository it unpacked and
// MAKEFUN_OUTPUT_DIR to the folder it scores; both default to the layout a
// person gets when they run the program by hand from the repository root.
const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const raw = readFileSync(join(botDir, "VIDEO.json"), "utf8");

// Refuse to hand over a file that does not name a video: the JSON must parse
// and carry a url string, or the entry is meaningless downstream.
const parsed: unknown = JSON.parse(raw);
const url =
  typeof parsed === "object" && parsed !== null
    ? (parsed as { url?: unknown }).url
    : undefined;
if (typeof url !== "string" || url.length === 0) {
  throw new Error("VIDEO.json must be a JSON object with a url string");
}

// The address has to be a TikTok video page — the full /@handle/video/<id>
// form. A short share link names no video until it is opened, so it is
// rejected here rather than handed to the grader to refuse.
if (!/^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+$/.test(url)) {
  throw new Error(`VIDEO.json url is not a TikTok video address: ${url}`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "VIDEO.json"), raw);
