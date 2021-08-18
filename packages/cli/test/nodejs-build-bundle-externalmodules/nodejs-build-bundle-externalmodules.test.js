const fs = require("fs");
const path = require("path");
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
 * Test that the synth command ran successfully
 */
test("nodejs-build-bundle-externalmodules", async () => {
  await runBuildCommand(__dirname, undefined, buildDir);

  // Directory structure
  //  /
  //    .build/
  //      cdk.out/
  //      lambda-handler-1612170130511
  //      lambda-handler-1612170130511.zip
  //      src-lambda-handler-1612170130511.zip
  //    src/
  //      .build/
  //        src-lambda-handler-1612170130511

  //////////////////////////////
  // Verify root Lambda's build output
  //////////////////////////////
  const rootBuildPath = path.join(__dirname, buildDir);
  const rootBuildFiles = fs.readdirSync(rootBuildPath);
  // Verify folder exists
  let handlerHash;
  rootBuildFiles.forEach((file) => {
    if (file.match(/^lambda-handler-[\d]+$/)) {
      handlerHash = file;
    }
  });
  expect(handlerHash).toBeDefined();
  // Verify external module is being required in code
  const rootCode = fs.readFileSync(
    path.join(rootBuildPath, handlerHash, "lambda.js")
  );
  expect(rootCode.indexOf('require("uuid")') > -1).toBeTruthy();
  expect(rootCode.indexOf('require("mirrarray")') === -1).toBeTruthy();

  //////////////////////////////
  // Verify src Lambda's build output
  //////////////////////////////
  const srcBuildPath = path.join(__dirname, buildDir, "src");
  const srcBuildFiles = fs.readdirSync(srcBuildPath);
  // Verify src Lambda's build output
  let srcHandlerHash;
  srcBuildFiles.forEach((file) => {
    if (file.match(/^src-lambda-handler-[\d]+$/)) {
      srcHandlerHash = file;
    }
  });
  expect(srcHandlerHash).toBeDefined();
  // Verify external module is being required in code
  const srcCode = fs.readFileSync(
    path.join(srcBuildPath, srcHandlerHash, "lambda.js")
  );
  expect(srcCode.indexOf('require("uuid")') === -1).toBeTruthy();
  expect(srcCode.indexOf('require("mirrarray")') > -1).toBeTruthy();
});
