const branchName = process.env.BRANCH_NAME;

if (!/^[a-z0-9-]+$/.test(branchName)) {
  console.log(`⚠️ Branch name "${branchName}" is invalid.`);
  console.log(
    "Branch names must be lowercase and may only contain a-z, dashes (-) and 0-9"
  );
  process.exit(1);
}
