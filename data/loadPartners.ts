import "server-only";
import fs from "fs";
import path from "path";
import { parse } from "yaml";
import type { Partner } from "@/data/partners";

export function loadPartners(): Partner[] {
  const file = path.join(process.cwd(), "data/partners.yaml");
  const raw = fs.readFileSync(file, "utf8");
  return parse(raw) as Partner[];
}
