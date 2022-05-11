import type { Config } from "@jest/types";
import nextJest from "next/jest";
import { compilerOptions } from "./tsconfig.json";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

/**
 * Make `tsconfig.json`'s `paths` work in Jest
 * @link https://stackoverflow.com/a/56792936
 */
function makeModuleNameMapperFromTsConfig(srcPath: string) {
  // Get paths from tsconfig
  const { paths }: { paths: Record<string, string[]> } = compilerOptions;

  const aliases: { [key: string]: string } = {};

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach((item) => {
    const key = item.replace("/*", "/(.*)");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const path = paths[item]![0]!.replace("/*", "/$1");
    aliases[key] = srcPath + "/" + path;
  });
  return aliases;
}

const customConfig: Config.InitialOptions = {
  verbose: true,
  testPathIgnorePatterns: ["<rootDir>/.next", "<rootDir>/playwright/"],
  moduleNameMapper: makeModuleNameMapperFromTsConfig("<rootDir>"),
  globalSetup: "./jest.setup.js",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customConfig);
