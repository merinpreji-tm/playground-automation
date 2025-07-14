import type { Reporter, TestCase, TestResult, FullResult, Suite } from '@playwright/test/reporter';
import fs from 'fs';

class CustomSummaryReporter implements Reporter {
    private passed = 0;
    private failed = 0;
    private skipped = 0;
    private flaky = 0;
    private total = 0;

    private reportId = process.env.REPORT_ID || 'default';
    private summaryPath = `playwright-report/summary-${this.reportId}.json`;

    onBegin(config: any, suite: Suite) {
        this.total = suite.allTests().length;
    }

    onTestEnd(test: TestCase, result: TestResult) {
        if (result.status === 'passed') this.passed++;
        else if (result.status === 'failed') this.failed++;
        else if (result.status === 'skipped') this.skipped++;
    }

    async onEnd(result: FullResult) {
        const passPercentage = this.total ? ((this.passed / this.total) * 100).toFixed(2) : '0.00';

        const report = {
            total: this.total,
            passed: this.passed,
            failed: this.failed,
            skipped: this.skipped,
            flaky: this.flaky,
            passPercentage: `${passPercentage}%`,
            reportId: this.reportId,
            timestamp: new Date().toISOString()
        };

        fs.mkdirSync('playwright-report', { recursive: true });
        fs.writeFileSync(this.summaryPath, JSON.stringify(report, null, 2));
        console.log(`Summary report written to ${this.summaryPath}`);
    }

}

export default CustomSummaryReporter;