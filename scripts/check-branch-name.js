const branchName = process.env.BRANCH_NAME;

// This is a temporary workaround necessary as we can't set up a trigger to
// run for everything except master.
if (branchName === "master") {
  console.log(
    "ℹ️ Aborting build as production deployment may not run on non-master branch."
  );
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(branchName)) {
  console.log(`⚠️ Branch name "${branchName}" is invalid.`);
  console.log(
    "Branch names must be lowercase and may only contain a-z, dashes (-) and 0-9"
  );
  process.exit(1);
}
