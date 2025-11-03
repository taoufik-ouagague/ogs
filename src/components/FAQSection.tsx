import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is an LLC?',
    answer:
      'A Limited Liability Company (LLC) is a business structure that combines the flexibility of a partnership with the liability protection of a corporation. It protects your personal assets from business debts and lawsuits.',
  },
  {
    question: 'How long does it take to form an LLC?',
    answer:
      'Processing times vary by package: Basic (5-7 business days), Ultimate (3-5 business days), and Epic (1-2 business days). These times are in addition to state processing times, which vary by location.',
  },
  {
    question: 'Which state should I form my LLC in?',
    answer:
      'Most businesses should form their LLC in the state where they primarily operate. However, Delaware, Wyoming, and Nevada are popular choices for their business-friendly laws. Our AI assistant can help you choose the right state for your needs.',
  },
  {
    question: 'Do I need an EIN for my LLC?',
    answer:
      'An EIN (Employer Identification Number) is required if you have employees, multiple members, or want to open a business bank account. Our Ultimate and Epic packages include EIN registration.',
  },
  {
    question: 'What is a registered agent?',
    answer:
      'A registered agent is a person or company designated to receive legal documents on behalf of your LLC. Every LLC must have a registered agent in the state where it\'s formed. Our Ultimate and Epic packages include 1 year of registered agent service.',
  },
  {
    question: 'What are the ongoing requirements for an LLC?',
    answer:
      'LLCs typically need to file annual reports, pay annual fees, and maintain good standing with the state. Requirements vary by state. Our Epic package includes compliance alerts to help you stay on track.',
  },
  {
    question: 'Can I form an LLC if I\'m not a U.S. citizen?',
    answer:
      'Yes! Non-U.S. citizens and residents can form an LLC in any state. You don\'t need to be a U.S. citizen or have a Social Security Number to start an LLC.',
  },
  {
    question: 'What\'s included in your packages?',
    answer:
      'Basic includes essential LLC registration and documents. Ultimate adds EIN registration and registered agent service. Epic includes everything plus bank account setup assistance and priority support. All packages include expert support and filing services.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer:
      'Yes! We offer a 100% satisfaction guarantee. If you\'re not completely satisfied with our service, contact us within 60 days for a full refund (excluding state filing fees).',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Our support team is available 24/7 via email (support@ogssolution.com), phone (+1 (555) 123-4567), or WhatsApp. You can also chat with our AI assistant anytime for instant answers.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about forming your LLC
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
          <p className="text-gray-700 dark:text-gray-300">
            Our AI assistant and support team are here to help 24/7.
          </p>
        </div>
      </div>
    </section>
  );
}
