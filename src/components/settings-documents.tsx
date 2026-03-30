// ABOUTME: Settings Documents tab — static compliance documents list with download links for Penetration test, SOC 2, DPA, Form W-9

const DOCUMENTS = [
  {
    title: "Penetration test",
    descriptions: [
      "Penetration testing is performed at least annually by third-party cybersecurity company, Oneleet.",
      "You can download the Letter of Attestation below.",
    ],
    file: "/static/documents/penetration-test.pdf",
  },
  {
    title: "SOC 2",
    descriptions: [
      "Resend is SOC 2 Type II compliant, a compliance framework developed by AICPA.",
      "This audit was completed by Vanta & Advantage Partners and covers the period of February 1, 2024 to February 1, 2025.",
    ],
    file: "/static/documents/soc2-report.pdf",
  },
  {
    title: "DPA",
    descriptions: [
      "Data Processing Agreement (DPA) is a contract that regulates data processing conducted for business purposes.",
      "The attached DPA is a version signed by us, and is considered fully executed once you signup to Resend.",
    ],
    file: "/static/documents/dpa.pdf",
  },
  {
    title: "Form W-9",
    descriptions: [
      "Form W-9 is a tax document used in the United States to provide a taxpayer identification number (TIN) to a person or entity that will be making payments.",
      "The attached Form W-9 is a version signed by us.",
    ],
    file: "/static/documents/form-w9.pdf",
  },
];

export function DocumentsTab() {
  return (
    <div className="space-y-4">
      {DOCUMENTS.map((doc) => (
        <div
          key={doc.title}
          className="border border-[rgba(176,199,217,0.145)] rounded-lg p-6"
        >
          <h3 className="text-[15px] font-semibold text-[#F0F0F0] mb-3">
            {doc.title}
          </h3>
          {doc.descriptions.map((desc) => (
            <p
              key={desc}
              className="text-[14px] text-[#A1A4A5] mb-2 leading-relaxed"
            >
              {desc}
            </p>
          ))}
          <a
            href={doc.file}
            className="mt-2 inline-flex items-center px-3 py-1.5 text-[13px] font-medium text-[#F0F0F0] bg-[rgba(176,199,217,0.08)] border border-[rgba(176,199,217,0.145)] rounded-md hover:bg-[rgba(176,199,217,0.15)] transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
