const fs = require("fs");
const path = require("path");
const { runStartCommand, clearBuildOutput } = require("../helpers");
const paths = require("../../scripts/util/paths");

beforeEach(async () => {
  await clearBuildOutput(__dirname);
});

afterAll(async () => {
  await clearBuildOutput(__dirname);
});

/**
 * Test that the synth command ran successfully
 */
test("start-base", async () => {
  await runStartCommand(__dirname);

  const testOutputPath = path.join(
    __dirname,
    paths.DEFAULT_BUILD_DIR,
    "test-output.json"
  );
  const testOutput = JSON.parse(fs.readFileSync(testOutputPath, "utf8"));

  expect(testOutput).toMatchObject({
    entryPointsData: {
      "./src/sns/sub-folder/sns.handler": {
        outEntryPoint: {
          entry: "sns.js",
          handler: "handler",
          srcPath: path.normalize(".build/src/sns/sub-folder"),
        },
      },
      "src/api/api.main": {
        outEntryPoint: {
          entry: "api.js",
          handler: "main",
          srcPath: path.normalize("src/api/.build"),
        },
      },
    },
  });
});
