import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { AllureRuntime, AllureGroup, AllureTest, Status, Stage } from 'allure-js-commons';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ARTIFACTS_DIR = path.join(process.cwd(), 'testArtifacts');
const PLAYWRIGHT_REPORT_DIR = path.join(process.cwd(), 'playwright-report');
const JSON_REPORT_DIR = path.join(ARTIFACTS_DIR, 'json-reports');

class AllureRepeatedReporter implements Reporter {
  private runtimes: Map<string, AllureRuntime> = new Map();
  private groups: Map<string, AllureGroup> = new Map();
  private tests: Map<string, AllureTest> = new Map();
  private testCount: Map<string, number> = new Map();
  private doneCount: Map<string, number> = new Map();
  private resultsSummary: Map<string, any[]> = new Map();

  onBegin(config: FullConfig, suite: Suite) {
    // Clean and prepare directories
    [PLAYWRIGHT_REPORT_DIR, ARTIFACTS_DIR].forEach(dir => {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true });
    });
    const subDirs = ['json-reports', 'excel-reports', 'csv-reports'];
    for (const dir of subDirs) {
      fs.mkdirSync(path.join(ARTIFACTS_DIR, dir), { recursive: true });
    }

    // Count total tests per file and repeat index
    for (const test of suite.allTests()) {
      const filePath = test.location.file;
      const repeat = test.repeatEachIndex ?? 0;
      const key = `${filePath}::${repeat}`;
      this.testCount.set(key, (this.testCount.get(key) || 0) + 1);
    }
  }

  onTestBegin(test: TestCase) {
    const file = test.location.file;
    const repeat = test.repeatEachIndex ?? 0;
    const fileName = path.basename(file).split('.')[0];
    const suffix = `-${repeat + 1}`;
    const resultDir = path.join(PLAYWRIGHT_REPORT_DIR, `allure-results-${fileName}${suffix}`);
    const key = `${file}::${repeat}`;

    if (!this.runtimes.has(key)) {
      fs.mkdirSync(resultDir, { recursive: true });
      this.runtimes.set(key, new AllureRuntime({ resultsDir: resultDir }));
    }

    const runtime = this.runtimes.get(key)!;
    let group = this.groups.get(key);
    if (!group) {
      group = runtime.startGroup(fileName);
      this.groups.set(key, group);
    }

    const allureTest = group.startTest(test.title);
    allureTest.fullName = test.title;
    allureTest.historyId = test.id;
    allureTest.stage = Stage.RUNNING;

    this.tests.set(test.id, allureTest);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const file = test.location.file;
    const repeat = test.repeatEachIndex ?? 0;
    const key = `${file}::${repeat}`;
    const fileName = path.basename(file).split('.')[0];
    const suffix = `-${repeat + 1}`;
    const resultDir = path.join(PLAYWRIGHT_REPORT_DIR, `allure-results-${fileName}${suffix}`);
    const reportDir = path.join(PLAYWRIGHT_REPORT_DIR, `allure-report-${fileName}${suffix}`);

    const allureTest = this.tests.get(test.id);
    if (allureTest) {
      if (result.status === 'passed') {
        allureTest.status = Status.PASSED;
      } else if (result.status === 'failed') {
        allureTest.status = Status.FAILED;
        allureTest.statusDetails = {
          message: result.error?.message,
          trace: result.error?.stack,
        };
      } else if (result.status === 'skipped') {
        allureTest.status = Status.SKIPPED;
      }

      for (const attachment of result.attachments) {
        if (attachment.name === 'screenshot' && attachment.path) {
          allureTest.addAttachment('Screenshot', 'image/png', attachment.path);
        }
      }

      allureTest.stage = Stage.FINISHED;
      allureTest.endTest();
      this.tests.delete(test.id);

      // Store result for JSON report
      if (!this.resultsSummary.has(key)) {
        this.resultsSummary.set(key, []);
      }

      this.resultsSummary.get(key)!.push({
        suiteName: test.parent?.title || 'unknown',
        testName: test.title,
        status: result.status.toUpperCase(),
        repeatIndex: repeat
      });
    }

    const completed = (this.doneCount.get(key) || 0) + 1;
    this.doneCount.set(key, completed);

    if (completed === this.testCount.get(key)) {
      try {
        // Generate Allure HTML report
        execSync(`npx allure generate ${resultDir} --clean -o ${reportDir}`, { stdio: 'inherit' });
        console.log(`Generated: ${reportDir}`);
      } catch (err) {
        console.error(`Failed to generate report for ${reportDir}`, err);
      }

      // Generate JSON report
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const jsonFileName = `test-report-${repeat + 1}-${timestamp}.json`;
      const jsonFilePath = path.join(JSON_REPORT_DIR, jsonFileName);
      const testResults = this.resultsSummary.get(key) || [];

      try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(testResults, null, 2));
        console.log(`JSON report written to ${jsonFilePath}`);
      } catch (err) {
        console.error(`Failed to write JSON report to ${jsonFilePath}`, err);
      }
    }
  }

  onEnd(result: FullResult) {
    for (const group of this.groups.values()) {
      group.endGroup();
    }
    this.groups.clear();

    // Compare JSON reports and move best Allure report to testArtifacts
    const jsonFiles = fs.readdirSync(JSON_REPORT_DIR).filter(file => file.endsWith('.json'));
    const reportStats: { file: string, percentage: number, allureReportDir: string }[] = [];

    for (const file of jsonFiles) {
      const filePath = path.join(JSON_REPORT_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const total = data.length;
      const passed = data.filter((t: any) => t.status === 'PASSED').length;
      const percentage = total > 0 ? (passed / total) * 100 : 0;

      // Derive corresponding allure report folder
      const match = file.match(/test-report-(\d+)-/);
      const repeatIndex = match ? match[1] : '1';
      const allureDir = fs.readdirSync(PLAYWRIGHT_REPORT_DIR)
        .find(dir => dir.startsWith('allure-report-') && dir.endsWith(`-${repeatIndex}`));

      if (allureDir) {
        reportStats.push({
          file,
          percentage,
          allureReportDir: path.join(PLAYWRIGHT_REPORT_DIR, allureDir)
        });
      }
    }

    // Find the best report
    reportStats.sort((a, b) => b.percentage - a.percentage);
    const best = reportStats[0];
    if (best) {
      const dest = path.join(ARTIFACTS_DIR, 'best-allure-report');
      fs.rmSync(dest, { recursive: true, force: true });
      fs.cpSync(best.allureReportDir, dest, { recursive: true });
      console.log(`Moved best Allure report (${best.percentage.toFixed(2)}%) to: ${dest}`);
    }
  }
}

export default AllureRepeatedReporter;