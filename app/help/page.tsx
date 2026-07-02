"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Mail, MessageSquare, BookOpen, Phone } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "faq1",
    question: "How do I register for next semester's courses?",
    answer:
      "You can register for courses through the portal during the registration window. Navigate to Courses → Register, choose your desired courses, and submit. Make sure to get your advisor's approval beforehand. Registration typically opens 2 weeks before the end of the current semester.",
  },
  {
    id: "faq2",
    question: "How is my CGPA calculated?",
    answer:
      "Your CGPA is a weighted average of grade points earned across all completed semesters, weighted by credit hours. A grade of A+ earns 4.0 points, A earns 3.75, and so on. The portal calculates this automatically under the Grades section.",
  },
  {
    id: "faq3",
    question: "What is the minimum attendance requirement?",
    answer:
      "Students must maintain at least 75% attendance in each course to be eligible to sit for the final exam. If attendance drops below 60%, you may be barred from the exam. Attendance is tracked and visible in your Grades and Schedule sections.",
  },
  {
    id: "faq4",
    question: "How do I contact my instructor?",
    answer:
      "You can message instructors directly through the Messages section of the portal. Alternatively, visit the Courses page and click on a course card — instructor contact details and office hours are listed there.",
  },
  {
    id: "faq5",
    question: "Can I retake a course to improve my grade?",
    answer:
      "Yes. Course retake requests can be submitted through the Academic Office. Both grades will appear on your transcript, but only the higher grade is factored into your CGPA. Retakes must be approved by your academic advisor.",
  },
  {
    id: "faq6",
    question: "How do I request an official transcript?",
    answer:
      "Official transcript requests can be made at the Registrar's office or via the Student Services portal under 'Documents'. Processing takes 3–5 working days. An expedited option (1–2 days) is available for an additional fee.",
  },
];

const CONTACT_OPTIONS = [
  { icon: <Mail size={18} />, label: "Email Support", detail: "support@puc.edu.bd", color: "text-neon", bg: "rgba(163,230,53,0.08)", border: "rgba(163,230,53,0.15)" },
  { icon: <Phone size={18} />, label: "Phone (Registrar)", detail: "+880-2-123-4567", color: "text-sky-400", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.15)" },
  { icon: <MessageSquare size={18} />, label: "Live Chat", detail: "Mon–Fri, 9AM–5PM", color: "text-violet-400", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.15)" },
  { icon: <BookOpen size={18} />, label: "Student Handbook", detail: "View online →", color: "text-amber-400", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.15)" },
];

export default function HelpPage() {
  const [openId, setOpenId] = useState<string | null>("faq1");
  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <header className="mb-8">
        <p className="page-breadcrumb">Account / Help</p>
        <h1 className="page-title-lg">Help Centre</h1>
        <p className="page-subtitle">Find answers, contact support, or browse the handbook</p>
      </header>

      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CONTACT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              className="rounded-clay-lg p-4 text-left transition-all duration-200 hover:-translate-y-0.5 group"
              style={{ background: opt.bg, border: `1px solid ${opt.border}`, boxShadow: "4px 4px 12px rgba(0,0,0,0.3)" }}
            >
              <span className={`${opt.color} block mb-3`}>{opt.icon}</span>
              <p className="text-xs font-syne font-bold text-white mb-1 leading-tight">{opt.label}</p>
              <p className="text-[10px] text-gray-500">{opt.detail}</p>
            </button>
          ))}
        </div>

        <div className="shadow-clay-raised rounded-clay-xl overflow-hidden" style={{ background: "#121216" }}>
          <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
            <HelpCircle size={16} className="text-neon" />
            <h2 className="font-syne font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div>
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={`border-b border-white/[0.04] ${i === FAQ_ITEMS.length - 1 ? "border-0" : ""}`}>
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.015] transition-colors"
                  >
                    <span className={`text-sm font-medium transition-colors ${isOpen ? "text-neon" : "text-gray-300"}`}>
                      {item.question}
                    </span>
                    <span className={`ml-4 shrink-0 transition-colors ${isOpen ? "text-neon" : "text-gray-600"}`}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="px-6 pb-5">
                      <div className="clay-input rounded-clay-lg p-4">
                        <p className="text-sm text-gray-400 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="shadow-clay-raised rounded-clay-xl p-6" style={{ background: "#121216" }}>
          <h2 className="font-syne font-bold text-white mb-5">Still need help?</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Subject", "Your Name"].map((label) => (
                <div key={label}>
                  <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{label}</label>
                  <input
                    type="text"
                    placeholder={label}
                    className="clay-input w-full py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Message</label>
              <textarea
                rows={4}
                placeholder="Describe your issue..."
                className="clay-input w-full py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none resize-none"
              />
            </div>
            <button className="clay-btn flex items-center gap-2 px-6 py-3 rounded-clay text-sm font-semibold font-syne text-space-950" style={{ background: "#a3e635" }}>
              <Mail size={15} />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
