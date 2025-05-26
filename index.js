const { execSync } = require("child_process");
const fs = require("fs");

const AUTHOR_NAME = "Anders";
const AUTHOR_EMAIL = "gl.dreamfulwork.0110@gmail.com";
const CO_AUTHOR = "Co-authored-by: eminw5 <jcusoft.dev@gmail.com>";
const BASE_BRANCH = "dev"; // or "master"
const REPO_DIR = "."; // adjust if needed

function exec(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: "inherit", cwd: REPO_DIR });
}

for (let i = 1; i <= 48; i++) {
  const branchName = `feature/pr-${i}`;
  const fileName = `pr-${i}.txt`;
  const prTitle = `Automated PR #${i}`;

  try {
    exec(`git checkout ${BASE_BRANCH}`);
    exec(`git pull origin ${BASE_BRANCH}`);
    exec(`git checkout -b ${branchName}`);

    // Make a trivial change (e.g., add a new file)
    fs.writeFileSync(`${REPO_DIR}/${fileName}`, `This is PR #${i}\n`);

    exec(`git add ${fileName}`);
    exec(`git commit -m "${prTitle}" -m "${CO_AUTHOR}"`);
    exec(`git push -f origin ${branchName}`);

    // Create PR using GitHub CLI
    exec(
      `gh pr create --title "${prTitle}" --body "Auto-generated PR with co-author." --base ${BASE_BRANCH} --head ${branchName}`
    );
  } catch (err) {
    console.error(`Failed on PR #${i}:`, err);
    break;
  }
}

console.log("✅ Done creating 48 PRs.");
