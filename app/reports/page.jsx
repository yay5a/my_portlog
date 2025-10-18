import ReportCard from "@/components/ReportCard";
import { getReports } from "@/utils/mdxUtils";

export default async function ReportsPage() {
    const reports = await getReports();

    return (
        <div className="max-w-2xl py-8 mx-auto space-y-4">
            <h1 className="mb-4 text-3xl font-bold">Technical Reports</h1>
            {reports.map((report) => (
                <ReportCard
                    key={report.slug}
                    title={report.title}
                    date={report.displayDate}
                    excerpt={report.excerpt}
                    slug={report.slug}
                />
            ))}
        </div>
    );
}
