import fs from 'fs';
import path from 'path';
import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

interface TestEntry {
  timestamp: string;
  suiteName: string;
  testName: string;
  status: 'PASSED' | 'FAILED';
  error?: string;
  screenshotPath?: string;
}

class JSONReporter implements Reporter {
  private testResults: TestEntry[] = [];
  private outputDir: string;
  private specTestCount: Map<string, number> = new Map();
  private specTestDoneCount: Map<string, number> = new Map();

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir || 'testArtifacts/json-reports';
    this.ensureDirectoryExistence(this.outputDir);
  }

  onBegin(config: FullConfig, suite: Suite) {
    for (const test of suite.allTests()) {
      const filePath = test.location.file;
      this.specTestCount.set(filePath, (this.specTestCount.get(filePath) || 0) + 1);
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const filePath = test.location.file;
    const suiteName = this.getFullSuiteName(test.parent);
    const testName = test.title;
    const status = result.status === 'passed' ? 'PASSED' : 'FAILED';
    const error = result.error ? this.sanitizeErrorMessage(result.error.message || '') : undefined;
    const screenshotPath = this.getScreenshotPath(result);
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `test-report-${timestamp}.json`;
    const outputFile = path.join(this.outputDir, fileName);

    this.testResults.push({ timestamp, suiteName, testName, status, error, screenshotPath });

    // Track number of completed tests for this spec file
    const completed = (this.specTestDoneCount.get(filePath) || 0) + 1;
    this.specTestDoneCount.set(filePath, completed);

    // If all tests in this file are done, generate the report
    if (completed === this.specTestCount.get(filePath)) {
      try {
        fs.writeFileSync(outputFile, JSON.stringify(this.testResults, null, 2));
        console.log(`JSON report written to ${outputFile}`);
      } catch (err) {
        console.error(`Failed to generate json report for ${fileName}`, err);
      }
    }
  }

  private getFullSuiteName(suite: Suite): string {
    const names: string[] = [];
    let currentSuite: Suite | undefined = suite;
    while (currentSuite) {
      if (currentSuite.title) names.unshift(currentSuite.title);
      currentSuite = currentSuite.parent;
    }
    return names.join(' › ') || 'Default Suite';
  }

  private sanitizeErrorMessage(errorMessage: string): string {
    return errorMessage
      .replace(/[\u001b\u009b]\[\d{1,2}(;\d{1,2})?(m|K)/g, '')
      .split('\n')[0]
      .trim();
  }

  private ensureDirectoryExistence(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
  // private async getScreenshotPath(testTitle: string, filePath: string) {
  //   try {
  //     const fileName = path.basename(filePath).split('.')[0];
  //     const folderPath = `testArtifacts/allure-results-${fileName}`;
  //     const files = fs.readdirSync(folderPath);
  //     for (const file of files) {
  //       if (file.endsWith('.json')) {
  //         const filePath = path.join(folderPath, file);
  //         const jsonContent = await fs.promises.readFile(filePath, 'utf8');
  //         const testData = JSON.parse(jsonContent);
  //         if (testData.name && testData.name === testTitle) {
  //           console.log(`Found screenshot for: ${testTitle}`);
  //           const screenshotAttachment = testData.attachments?.find((att: any) => att.type === 'image/png');
  //           if (screenshotAttachment) {
  //             console.log(screenshotAttachment.source);
  //             return path.resolve(folderPath, screenshotAttachment.source);
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error finding screenshot path:', error);
  //   }
  // }
  private getScreenshotPath(result: TestResult): string | null {
    const screenshotAttachment = result.attachments.find(att => att.name === 'screenshot' && att.path);
    return screenshotAttachment?.path || null;
  }

}

export default JSONReporter;