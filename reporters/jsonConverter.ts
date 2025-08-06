import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

interface TestEntry {
  suiteName: string;
  testName: string;
  status: 'PASSED' | 'FAILED' | 'UNKNOWN';
  error?: string;
  screenshotPath?: string;
}

export default class JSONToExcelConverter {
  private outputFilePath: string;
  private testResults: TestEntry[] = [];
  private workbook = new ExcelJS.Workbook();
  private worksheet: ExcelJS.Worksheet;
  private styles: any;

  constructor(outputFilePath: string) {
    this.outputFilePath = outputFilePath;
    this.initializeStyles();
  }

  async convertJSONFolderToExcel(folderPath: string) {
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
      this.createTestResultSheet();
      this.writeSummary();
      this.generateExcelReport();
    } catch (error) {
      console.error('Error converting JSON to Excel:', error);
    }
  }

  private addTestResult(test: TestEntry) {
    const suiteName = this.removeSuiteSuffix(test.suiteName || 'Default Suite');
    const error = test.error || '';
    const status = test.status || 'UNKNOWN';
    const screenshotPath = test.screenshotPath || '';
    this.testResults.push({ suiteName, testName: test.testName, status, error, screenshotPath });
  }

  private removeSuiteSuffix(suiteName: string): string {
    const regex = /suite\d+$/i;
    return regex.test(suiteName) ? suiteName.replace(regex, '') : suiteName;
  }

  private createTestResultSheet() {
    this.worksheet = this.workbook.addWorksheet('Test Results', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    this.worksheet.columns = [
      { header: 'Suite Name', key: 'suiteName', width: 25 },
      { header: 'Test Name', key: 'testName', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Error', key: 'error', width: 60 },
      { header: 'Screenshot', key: 'screenshotPath', width: 40 }
    ];

    const screenshotCol = 5;

    this.worksheet.getRow(1).eachCell(cell => {
      cell.style = this.styles.header;
    });

    let prevSuiteName: string | null = null;
    let mergeStartRow = 1;

    this.testResults.forEach((testResult, index) => {
      const currentSuiteName = testResult.suiteName;
      if (prevSuiteName !== currentSuiteName) {
        if (mergeStartRow !== index + 1) {
          this.worksheet.mergeCells(mergeStartRow + 1, 1, index + 1, 1);
          this.worksheet.getCell(mergeStartRow + 1, 1).style = this.styles.suiteName;
        }
        mergeStartRow = index + 1;
      }
      prevSuiteName = currentSuiteName;

      const row = this.worksheet.addRow(testResult);
      row.getCell(3).alignment = { horizontal: 'center' };
      row.getCell(4).alignment = { wrapText: true };
      row.eachCell(cell => {
        cell.border = this.styles.cellBorder;
      });

      if (testResult.screenshotPath && fs.existsSync(testResult.screenshotPath)) {
        const imageId = this.workbook.addImage({
          filename: testResult.screenshotPath,
          extension: 'png',
        });

        const rowNumber = index + 2; // Row number in Excel
        const colNumber = screenshotCol; // Screenshot column

        // Clear the cell value (remove text path)
        const screenshotCell = this.worksheet.getCell(rowNumber, colNumber);
        screenshotCell.value = ''; // Remove any existing text

        // Adjust column width and row height dynamically
        this.worksheet.getColumn(colNumber).width = 35; // Adjust width to fit image
        this.worksheet.getRow(rowNumber).height = 100; // Adjust height to fit image

        // Insert image in the cell
        this.worksheet.addImage(imageId, {
          tl: { col: colNumber - 1, row: rowNumber - 1 }, // Top-left position (0-indexed)
          ext: { width: 250, height: 140 }, // Image size in pixels
        });
      } else {
        const screenshotCell = this.worksheet.getCell(index + 2, screenshotCol);
        screenshotCell.value = 'No Screenshot';
        screenshotCell.alignment = { horizontal: 'center', vertical: 'middle' };
        screenshotCell.font = { italic: true, color: { argb: '808080' } };
      }

      row.getCell(3).fill =
        testResult.status === 'FAILED' ? this.styles.failedFill : this.styles.passedFill;
    });

    if (mergeStartRow !== this.testResults.length) {
      this.worksheet.mergeCells(mergeStartRow + 1, 1, this.testResults.length + 1, 1);
      this.worksheet.getCell(mergeStartRow + 1, 1).style = this.styles.suiteName;
    }
  }

  private writeSummary() {
    const summarySheet = this.workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 15 },
    ];

    summarySheet.getRow(1).eachCell(cell => {
      cell.style = this.styles.summaryHeader;
    });

    const summaryStats = this.calculateSummaryStats();

    summaryStats.forEach(stat => {
      summarySheet.addRow(stat);
    });

    summarySheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell(cell => {
          cell.style = this.styles.dataCell;
        });
      }
    });

    summarySheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  private generateExcelReport() {
    this.workbook.xlsx
      .writeFile(this.outputFilePath)
      .then(() => {
        console.log(`Excel report successfully written to ${this.outputFilePath}`);
      })
      .catch(error => {
        console.error('Error writing Excel report:', error);
      });
  }

  private initializeStyles() {
    this.styles = {
      header: {
        font: { name: 'Calibri', bold: true, color: { argb: 'FFFFFF' } },
        alignment: { horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '4F81BD' } },
        border: this.getBorderStyle('medium'),
      },
      cellBorder: this.getBorderStyle('thin'),
      passedFill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } },
      failedFill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0000' } },
      suiteName: { font: { bold: true } },
      summaryHeader: {
        font: { name: 'Calibri', bold: true, color: { argb: 'FFFFFF' } },
        alignment: { horizontal: 'center' },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '002060' } },
        border: this.getBorderStyle('medium'),
      },
      dataCell: {
        font: { name: 'Calibri', bold: false },
        alignment: { horizontal: 'center' },
        border: this.getBorderStyle('thin'),
      },
    };
  }

  private getBorderStyle(style: 'thin' | 'medium') {
    return {
      top: { style, color: { argb: '000000' } },
      left: { style, color: { argb: '000000' } },
      bottom: { style, color: { argb: '000000' } },
      right: { style, color: { argb: '000000' } },
    };
  }

  private calculateSummaryStats(): { metric: string; value: number }[] {
    const passedCount = this.testResults.filter(test => test.status === 'PASSED').length;
    const failedCount = this.testResults.filter(test => test.status === 'FAILED').length;
    const totalCount = this.testResults.length;
    return [
      { metric: 'Total Tests', value: totalCount },
      { metric: 'Passed Tests', value: passedCount },
      { metric: 'Failed Tests', value: failedCount },
    ];
  }

  public writeSummaryInTextFile(folderPath: string) {
    const summary = this.calculateSummaryStats()
      .map(stat => `${stat.metric}: ${stat.value}`)
      .join(', ');
    const filePath = path.join(folderPath, 'test-summary.txt');
    fs.writeFileSync(filePath, summary);
  }

  public calculatePassPercentage(): string {
    const totalCount = this.testResults.length;
    const passedCount = this.testResults.filter(test => test.status === 'PASSED').length;
    return ((passedCount / totalCount) * 100).toFixed(2);
  }
}