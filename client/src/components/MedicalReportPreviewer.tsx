import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Printer, 
  Download, 
  Activity, 
  FileText, 
  Calendar, 
  User 
} from "lucide-react";
import { toast } from "sonner";

interface MedicalReportPreviewerProps {
  record: {
    type: string;
    date: string;
    doctor: string;
    result: string;
    notes: string;
    patientName?: string;
  };
  onClose?: () => void;
}

export const MedicalReportPreviewer = ({ record, onClose }: MedicalReportPreviewerProps) => {
  const [zoom, setZoom] = useState<number>(100);
  const patientUser = JSON.parse(localStorage.getItem("user") || "{}");
  const patientName = record.patientName || patientUser.name || "Rahul Verma";

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 80));
  const handleZoomReset = () => setZoom(100);

  const handlePrint = () => {
    // Open print view of the document container specifically
    const printContent = document.getElementById("medical-report-printable-area");
    if (!printContent) return;
    
    const originalBody = document.body.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Medical Report - ${record.type}</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                color: #000;
                background: #fff;
                padding: 20px;
              }
              .print-container {
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #0f766e;
                padding-bottom: 15px;
                margin-bottom: 20px;
              }
              .logo-container {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .logo-icon {
                color: #0f766e;
                font-size: 24px;
                font-weight: bold;
              }
              .clinic-title {
                font-size: 20px;
                font-weight: 800;
                color: #0f766e;
              }
              .report-title {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin: 20px 0;
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .details-grid {
                display: grid;
                grid-template-cols: 1fr 1fr;
                gap: 15px;
                margin-bottom: 25px;
                background: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
              }
              .details-item {
                font-size: 14px;
              }
              .details-label {
                font-weight: bold;
                color: #4b5563;
              }
              .section-heading {
                font-size: 16px;
                font-weight: bold;
                color: #0f766e;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 5px;
                margin-top: 20px;
                margin-bottom: 10px;
              }
              .content-box {
                background: #fafafa;
                border: 1px dashed #d1d5db;
                padding: 15px;
                border-radius: 6px;
                font-family: monospace;
                white-space: pre-wrap;
                font-size: 13px;
                line-height: 1.5;
              }
              .notes-box {
                font-size: 13px;
                color: #374151;
                line-height: 1.6;
              }
              .footer-signature {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
              }
              .signature-line {
                border-top: 1px solid #9ca3af;
                width: 200px;
                text-align: center;
                padding-top: 5px;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    toast.success(`Downloaded: ${record.type.toLowerCase().replace(" ", "_")}_report.pdf`);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Premium Glassmorphic Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-secondary/50 border border-border/80 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomOut} 
            disabled={zoom <= 80}
            className="h-8 w-8 rounded-full"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-semibold font-mono w-12 text-center bg-card/60 py-1 rounded-md border border-border/40">
            {zoom}%
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomIn} 
            disabled={zoom >= 150}
            className="h-8 w-8 rounded-full"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomReset} 
            disabled={zoom === 100}
            className="h-8 w-8 rounded-full"
            title="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="rounded-full h-8 flex items-center gap-1 text-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Report
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleDownload}
            className="rounded-full h-8 flex items-center gap-1 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Sheet Area with scaling factor */}
      <div className="flex-1 overflow-auto border border-border/80 rounded-2xl bg-white text-zinc-950 p-6 md:p-8 shadow-inner relative max-h-[500px]">
        <div 
          id="medical-report-printable-area" 
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}
          className="mx-auto max-w-2xl text-left"
        >
          {/* Clinical Letterhead Header */}
          <div className="header flex justify-between items-center border-b-2 border-teal-700 pb-4 mb-6">
            <div className="logo-container flex items-center gap-2">
              <div className="h-10 w-10 bg-teal-700 rounded-full flex items-center justify-center shadow-md">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="clinic-title font-extrabold text-teal-700 tracking-tight text-lg block">MedConnect Labs</span>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">Diagnostics & Patient Care</span>
              </div>
            </div>
            <div className="text-right text-xs text-zinc-500 font-medium">
              <p>Helpline: +91 1800-123-4567</p>
              <p>support@medconnect.in</p>
            </div>
          </div>

          {/* Report Title */}
          <div className="report-title text-center text-xl font-bold uppercase tracking-widest text-zinc-950 my-6">
            Clinical Lab Diagnostic Report
          </div>

          {/* Details Grid Table */}
          <div className="details-grid grid grid-cols-2 gap-4 bg-zinc-50 p-4 border border-zinc-200 rounded-xl mb-6 text-sm">
            <div className="space-y-1.5">
              <p className="details-item"><span className="details-label text-zinc-500 font-semibold block text-xs">PATIENT NAME</span> <span className="font-bold text-zinc-900">{patientName}</span></p>
              <p className="details-item"><span className="details-label text-zinc-500 font-semibold block text-xs">REGISTRATION DATE</span> <span className="font-semibold text-zinc-900">{record.date}</span></p>
            </div>
            <div className="space-y-1.5">
              <p className="details-item"><span className="details-label text-zinc-500 font-semibold block text-xs">ATTENDING PHYSICIAN</span> <span className="font-bold text-teal-800">{record.doctor}</span></p>
              <p className="details-item"><span className="details-label text-zinc-500 font-semibold block text-xs">REPORT CATEGORY</span> <span className="font-semibold text-zinc-900">{record.type}</span></p>
            </div>
          </div>

          {/* Section: Clinical Results */}
          <div className="section-heading text-sm font-bold text-teal-700 border-b border-zinc-200 pb-1 mb-3 uppercase tracking-wider">
            Clinical Results / Observations
          </div>
          <div className="content-box bg-zinc-50/50 border border-dashed border-zinc-300 p-4 rounded-xl font-mono text-zinc-800 text-xs leading-relaxed mb-6 whitespace-pre-line">
            {record.result}
          </div>

          {/* Section: Doctor Remarks */}
          <div className="section-heading text-sm font-bold text-teal-700 border-b border-zinc-200 pb-1 mb-3 uppercase tracking-wider">
            Physician Recommendations & Remarks
          </div>
          <div className="notes-box text-zinc-700 text-sm leading-relaxed mb-10 pl-2">
            {record.notes}
          </div>

          {/* Signatures */}
          <div className="footer-signature flex justify-between items-end mt-12 pt-6 border-t border-zinc-100">
            <div className="signature-line border-t border-zinc-400 w-44 text-center pt-1.5 text-xs text-zinc-500">
              Lab Supervisor Signature
            </div>
            <div className="signature-line border-t border-zinc-400 w-44 text-center pt-1.5 text-xs text-zinc-500">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
