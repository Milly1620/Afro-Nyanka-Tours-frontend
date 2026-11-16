import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SOURCE_ROOT = join(__dirname);

const BANNED_PATTERNS: { name: string; pattern: RegExp; includeTests: boolean }[] = [
  { name: "mock data module import", pattern: /from\s+["'][^"']*(mockData|adminMockData|fallbackTours)["']/, includeTests: true },
  { name: "lorem ipsum placeholder copy", pattern: /lorem ipsum/i, includeTests: true },
  { name: "fallback tour helper", pattern: /getFallbackTours|FALLBACK_TOURS/, includeTests: true },
  { name: "mock identifier", pattern: /\b(mock[A-Z]\w*|initial(Events|Tours|Company)\w*)\b/, includeTests: false },
];

const SELF = "noDummyData.test.ts";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) && entry !== SELF ? [path] : [];
  });
}

describe("source tree", () => {
  it("contains no mock data modules", () => {
    const files = readdirSync(join(SOURCE_ROOT, "data"));
    expect(files.filter((file) => /mock|fallback/i.test(file))).toEqual([]);
  });

  it.each(BANNED_PATTERNS)("has no $name", ({ pattern, includeTests }) => {
    const offenders = sourceFiles(SOURCE_ROOT)
      .filter((file) => includeTests || !/\.test\.tsx?$/.test(file))
      .filter((file) => pattern.test(readFileSync(file, "utf8")))
      .map((file) => relative(SOURCE_ROOT, file));
    expect(offenders).toEqual([]);
  });
});
