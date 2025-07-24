import fs from 'fs';
import path from 'path';

interface TestEntry {
  suiteName: string;
  testName: string;
  status: 'PASSED' | 'FAILED' | 'UNKNOWN';
  error?: string;
}

export default class JSONToCsvConverter {
  private outputFilePath: string;
  private testResults: TestEntry[] = [];

  constructor(outputFilePath: string) {
    this.outputFilePath = outputFilePath;
  }

  async convertJSONFolderToCsv(folderPath: string) {
    try {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(folderPath, file);
          const jsonContent = await fs.promises.readFile(filePath, 'utf8');
          const testData: TestEntry[] = JSON.parse(jsonContent);
          if (Array.isArray(testData)) {
            for (const test of testData) {
              this.addTestResult(test);
            }
          }
        }
      }
      this.generateCsvReport();
    } catch (error) {
      console.error('Error converting JSON to CSV:', error);
    }
  }

  private addTestResult(test: TestEntry) {
    const suiteName = this.removeSuiteSuffix(test.suiteName || 'Default Suite');
    const error = test.error || '';
    const status = test.status || 'UNKNOWN';
    this.testResults.push({ suiteName, testName: test.testName, status, error });
  }

  private removeSuiteSuffix(suiteName: string): string {
    const regex = /suite\d+$/i;
    return regex.test(suiteName) ? suiteName.replace(regex, '') : suiteName;
  }

  private generateCsvReport() {
    const header = ['Suite Name', 'Test Name', 'Status', 'Error'];
    const rows = this.testResults.map(test =>
      [test.suiteName, test.testName, test.status, test.error?.replace(/\n/g, ' ')].map(val => `"${val}"`).join(',')
    );

    const csvContent = [header.join(','), ...rows].join('\n');
    fs.writeFileSync(this.outputFilePath, csvContent, 'utf8');

    console.log(`CSV report successfully written to ${this.outputFilePath}`);
  }
}