const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clean up previous html-report folders inside playwright-report
const htmlDirs = fs.readdirSync('playwright-report', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('html-report-'))
  .map(dirent => path.join('playwright-report', dirent.name));

htmlDirs.forEach(dir => fs.rmSync(dir, { recursive: true, force: true }));

// Clean summary JSON files
const summaryFiles = fs.existsSync('playwright-report')
  ? fs.readdirSync('playwright-report')
      .filter(file => file.startsWith('summary-') && file.endsWith('.json'))
      .map(file => path.join('playwright-report', file))
  : [];

summaryFiles.forEach(file => fs.rmSync(file, { force: true }));

const [, , testFile, browserName = 'chromium', instanceCount = '2', ...extraArgs] = process.argv;

if (!testFile) {
  console.error('Usage: node parallelRunner.js <testFile> [browserName] [instanceCount]');
  process.exit(1);
}

const count = parseInt(instanceCount);
const processes = [];
let completed = 0;

for (let i = 0; i < count; i++) {
  const reportId = `run-${i + 1}`;

  const child = spawn('npx playwright test', [
    testFile,
    `--project=${browserName}`,
    '--workers=1',
    ...extraArgs
  ], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      REPORT_ID: reportId,
      TEST_RUN_ID: `${i + 1}`
    }
  });

  child.on('exit', code => {
    console.log(`Test instance ${i + 1} (REPORT_ID=${reportId}) exited with code ${code}`);
    completed++;

    if (completed === count) {
      console.log('All instances completed. Evaluating best run...');
      evaluateBestRun(count);
    }
  });

  processes.push(child);
}

function evaluateBestRun(totalRuns) {
  let bestRun = null;
  let bestPassPercentage = -1;

  for (let i = 0; i < totalRuns; i++) {
    const reportId = `run-${i + 1}`;
    const summaryPath = path.join('playwright-report', `summary-${reportId}.json`);
    const htmlReportPath = path.join('playwright-report', `html-report-${reportId}`);

    if (fs.existsSync(summaryPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
      const passPct = parseFloat(summary.passPercentage.replace('%', ''));

      if (passPct > bestPassPercentage) {
        bestPassPercentage = passPct;
        bestRun = { reportId, htmlReportPath };
      }
    } else {
      console.warn(`Summary file not found for ${reportId}`);
    }
  }

  if (bestRun) {
    const destination = path.join('testArtifacts', 'best-html-report');
    fs.rmSync(destination, { recursive: true, force: true });
    fs.mkdirSync('testArtifacts', { recursive: true });
    fs.cpSync(bestRun.htmlReportPath, destination, { recursive: true });
    console.log(`Best HTML report (${bestRun.reportId}, ${bestPassPercentage}%) copied to ${destination}`);
  } else {
    console.warn('No valid summary files found.');
  }
}