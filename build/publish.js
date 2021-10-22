
const { existsSync } = require('fs');
const { execSync } = require('child_process');
const { exec, spawn } = require('child-process-promise');
const { prompt, Confirm } = require('enquirer');
const path = require('path');
const semver = require('semver');
const Spinner = require('cli-spinner').Spinner;
const ac = require('ansi-colors');
const { copy } = require('./utils/copy');

const { distDir } = require('./utils/utils');

let pipeNull;
let npmCmd = 'npm';
// windows / linux 屏蔽输出的方式不同
if (process.platform === 'win32') {
  pipeNull = '2>NUL';
  npmCmd = 'npm.cmd';
} else {
  pipeNull = '2>/dev/null';
}

async function getReleaseVersion() {
  const dir = path.resolve(process.cwd(), 'package.json');
  if (!existsSync(dir)) {
    throw new Error(dir + 'doesn\'t exist');
  }

  let version = require(dir).version

  if (!version) {
    throw new Error('no version in package.json');
  }

  const releaseType = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
  const choices = releaseType.map(item => `${item}: ${semver.inc(version, item)}`);

  ({ version } = await prompt({
    name: 'version',
    type: 'select',
    message: 'Select release version',
    choices: choices
  }));

  return version.split(':')[1].trim()
}

// 如果发生 任意错误 既退出整个脚本
(async () => {
  try {
    execSync('git checkout dev');

    // = ---------------------------- = progress unit test = ---------------------------- =
    console.info(':: =--= Testing :: =--=');
    await exec(`${npmCmd} run test`);

    // = ---------------------------- = check work tree = ---------------------------- =
    console.info(':: =--= Checking Work Tree :: =--=');
    let res;
    res = await exec('git status --porcelain');

    if (res.stdout.toString().trim().length) {
      console.error('Unclean working tree. Commit or stash changes first.');
      process.exit(1);
    }

    // = ---------------------------- = check remote status = ---------------------------- =
    console.info(':: =--= Checking Status :: =--=');
    try {
      await exec(`git fetch --quiet ${pipeNull}`);
    } catch (e) {
      console.error('There was a problem fetching your branch. Run `git fetch` to see more...')
      process.exit();
    }

    // = ---------------------------- = check remote history = ---------------------------- =
    console.info(':: =--= Checking History :: =--=');
    try {
      res = await exec(`git rev-list --count --left-only @{upstream} ...HEAD`);
      if (res.stdout.trim() !== '0') {
        console.error('Remote history differ. Please pull changes.');
        process.exit();
      }
    } catch (e) {
      if (e.stderr.toString().indexOf('no upstream') !== -1) {
        console.error(e.stderr.toString());
        process.exit();
      } else {
        throw e;
      }
    }

    // = ---------------------------- = release & publish = ---------------------------- =
    const version = await getReleaseVersion();

    console.info(':: =--= Releasing :: =--=');
    // confirm
    const prompt = new Confirm({ name: 'isSure', message: `Releasing ${version} - are you sure?` });
    let answer = await prompt.run()
    !answer && process.exit();

    const spinner = new Spinner(`${ac.green('√')} Releasing ${version} ... %s`);
    spinner.setSpinnerString('⣾⣽⣻⢿⡿⣟⣯⣷');
    spinner.start();

    // build
    console.info(':: =--= Building :: =--=');
    await exec(`${npmCmd} run build ${pipeNull}`);

    // set version
    await exec(`${npmCmd} version ${version} --message "[release] ${version}"`);

    // publish
    console.info(':: =--= Publishing :: =--=');
    await copy(path.resolve(__dirname, '../package.json'), distDir);
    process.chdir(distDir);
    await exec(`${npmCmd} publish --registry https://verdaccio.newlinks.com/`);

    spinner.stop();

    console.log(`\n${ac.red('♥')} Release complete!`);
  } catch (e) {
    if (e.stderr) {
      console.error(e.stderr);
    } else if (e.stdout) {
      console.error(e.stdout);
    } else {
      console.error(e);
    }
    process.exit(1);
  }
})()
