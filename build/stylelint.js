
const { execSync } = require('child_process');
const chalk = require('chalk');
const stylelint = require('stylelint');
const CodeframeFormatter = require('stylelint-codeframe-formatter');

// helpers ==========================
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

function format(label, msg) {
  let lines = msg.split('\n');
  lines = lines.map((line, idx) => (
    idx === 0 ?
      `${label} ${line}` :
      line.padStart(chalk.reset(label).length)
  ));

  return lines.join('\n');
}
// ==================================


async function lint() {
  const options = Object.assign({}, {
    configBasedir: process.cwd(),
    fix: true,
    files: ['src/**/*.{vue,htm,html,css,sss,less,scss}'],
    formatter: CodeframeFormatter,
  });

  try {
    const { errored, results, output: formattedOutput } = await stylelint.lint(options);
    if (!errored) {
      const hasWarnings = results.some((result) => {
        if (result.ignored) {
          return null;
        }
        return result.warnings.some(warning => warning.severity === 'warning');
      });
      if (hasWarnings) {
        console.log(formattedOutput);
      } else {
        console.log(format(
          chalk`{bgGreen.black  DONE }`,
          `No stylelint errors found!${options.fix ? chalk` {blue (autofix enabled)}` : ''}`,
        ));
      }
    } else {
      console.log(formattedOutput);
      process.exit(1);
    }
  } catch (err) {
    console.log(format(
      chalk`{bgRed.black  ERROR }`,
      err.stack.slice(' Error:'.length),
    ));
    process.exit(1);
  }
}

lint();
