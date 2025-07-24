import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { AllureRuntime, AllureGroup, AllureTest, Status, Stage } from 'allure-js-commons';
import JSONToExcelConverter from './jsonConverter';
import JSONToCsvConverter from './csvReporter';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ARTIFACTS_DIR = path.join(process.cwd(), 'testArtifacts');

class AllureReporter implements Reporter {
  private allureRuntimes: Map<string, AllureRuntime> = new Map();
  private specTestCount: Map<string, number> = new Map();
  private specTestDoneCount: Map<string, number> = new Map();
  private allureGroups: Map<string, AllureGroup> = new Map();
  private allureTests: Map<string, AllureTest> = new Map();

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
    if (fs.existsSync(ARTIFACTS_DIR)) {
      fs.rmSync(ARTIFACTS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    const subDirs = ['json-reports', 'excel-reports', 'csv-reports'];
    for (const dir of subDirs) {
      const fullPath = path.join(ARTIFACTS_DIR, dir);
      fs.mkdirSync(fullPath, { recursive: true });
    }

    // Count number of tests per spec file
    for (const test of suite.allTests()) {
      const filePath = test.location.file;
      this.specTestCount.set(filePath, (this.specTestCount.get(filePath) || 0) + 1);
    }
  }

  onTestBegin(test: TestCase, result: TestResult) {
    const filePath = test.location.file;
    const baseName = path.basename(filePath);
    const fileName = baseName.split('.')[0];
    const resultDir = path.join(ARTIFACTS_DIR, `allure-results-${fileName}`);

    // Ensure the runtime for this spec file exists
    if (!this.allureRuntimes.has(filePath)) {
      fs.mkdirSync(resultDir, { recursive: true });
      const runtime = new AllureRuntime({ resultsDir: resultDir });
      this.allureRuntimes.set(filePath, runtime);
    }
    const runtime = this.allureRuntimes.get(filePath)!;
    // Create a group for this spec file if not yet created
    let group = this.allureGroups.get(filePath);
    if (!group) {
      group = runtime.startGroup(fileName);
      this.allureGroups.set(filePath, group);
    }
    const allureTest = group.startTest(test.title);
    allureTest.fullName = test.title;
    allureTest.historyId = test.id;
    allureTest.stage = Stage.RUNNING;
    // Save the test object for onTestEnd
    this.allureTests.set(test.id, allureTest);
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const filePath = test.location.file;
    const fileName = path.basename(filePath).split('.')[0];
    const resultDir = path.join(ARTIFACTS_DIR, `allure-results-${fileName}`);
    const reportDir = path.join(ARTIFACTS_DIR, `allure-report-${fileName}`);
    const jsonFolderPath = path.join(ARTIFACTS_DIR, 'json-reports');

    // Finalize the test in Allure
    const allureTest = this.allureTests.get(test.id);

    if (allureTest) {
      // Set test status
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

      // Attach screenshots (first .png file from attachments)
      for (const attachment of result.attachments) {
        if (attachment.name === 'screenshot' && attachment.path) {
          const filePath = attachment.path;
          allureTest.addAttachment('Screenshot', 'image/png', filePath);
        }
      }
      allureTest.stage = Stage.FINISHED;
      allureTest.endTest();
      this.allureTests.delete(test.id);
    }

    // Track number of completed tests for this spec file
    const completed = (this.specTestDoneCount.get(filePath) || 0) + 1;
    this.specTestDoneCount.set(filePath, completed);

    // If all tests in this file are done, generate the report
    if (completed === this.specTestCount.get(filePath)) {
      try {
        execSync(`npx allure generate ${resultDir} --clean -o ${reportDir}`, {
          stdio: 'inherit',
        });
      } catch (err) {
        console.error(`Failed to generate Allure report for ${fileName}`, err);
      }

      // Generate Excel report
      try {
        const excelOutputPath = path.join(ARTIFACTS_DIR, `excel-reports`, `excel-report-${fileName}.xlsx`);
        const converter = new JSONToExcelConverter(excelOutputPath);
        converter.convertJSONFolderToExcel(jsonFolderPath);
      } catch (err) {
        console.error(`Failed to generate Excel report for ${fileName}`, err);
      }

      // Generate CSV report
      try {
        const csvOutputPath = path.join(ARTIFACTS_DIR, `csv-reports`, `csv-report-${fileName}.csv`);
        const converter = new JSONToCsvConverter(csvOutputPath);
        converter.convertJSONFolderToCsv(jsonFolderPath);
      } catch (err) {
        console.error(`Failed to generate Csv report for ${fileName}`, err);
      }
    }
  }

  onEnd(result: FullResult) {
    for (const group of this.allureGroups.values()) {
      group.endGroup();
    }
    this.allureGroups.clear();
    console.log(`Finished the run: ${result.status}`);
  }
}

export default AllureReporter;