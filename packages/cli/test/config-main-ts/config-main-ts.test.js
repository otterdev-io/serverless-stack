const {
  runBuildCommand,
  clearBuildOutput,
  testBuildDir: buildDir,
} = require("../helpers");

beforeEach(async () => {
  await clearBuildOutput(__dirname, buildDir);
});

afterAll(async () => {
  await clearBuildOutput(__dirname, buildDir);
});

/**
 * Test that the config.json is getting picked up
 */
test("config-main-ts", async () => {
  const result = await runBuildCommand(__dirname, undefined, buildDir);
  expect(result).toMatch(/config-main-ts-prod-us-west-2/);
});
