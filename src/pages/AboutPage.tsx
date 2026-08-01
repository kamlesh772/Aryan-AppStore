import React, { useState } from 'react';
import { Info, ShieldCheck, Code, HelpCircle, Mail, Heart, ExternalLink, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  onOpenSubmitModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenSubmitModal }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Aryan App Store?',
      a: 'Aryan App Store is a free, open-source Android App Store dedicated exclusively to legally distributable software, open-source applications (GPL, MIT, Apache), and independent developer builds.'
    },
    {
      q: 'Does Aryan App Store host paid or copyrighted commercial apps?',
      a: 'No! We strictly enforce a Zero-Piracy policy. Copyrighted commercial apps or paid APKs are strictly prohibited. We only list open-source software and apps whose licenses explicitly allow free redistribution.'
    },
    {
      q: 'How do downloads work?',
      a: 'Aryan App Store provides direct, untracked links to official open-source release binaries (e.g., F-Droid mirrors, GitHub releases, official developer mirrors) so you receive clean, original APKs directly on your device.'
    },
    {
      q: 'Can I install this store on my mobile home screen?',
      a: 'Yes! Aryan App Store is built as a Progressive Web App (PWA). Tap "Install PWA" or select "Add to Home Screen" in your mobile browser to run it like a native Android app.'
    },
    {
      q: 'How can I submit my app?',
      a: 'Android developers can submit their open-source app details and source code repository link via our "Submit Your App" form.'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-3 shadow-xl">
        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
          Open Source & Free Software
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Info className="w-7 h-7 text-green-400" />
          <span>About Aryan App Store</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
          Empowering users and developers with a clean, fast, and privacy-first Android app repository free from tracking, intrusive ads, or proprietary lock-in.
        </p>
      </div>

      {/* Core Values / Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base text-white">100% Legal & Open Source</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Every listed application is open source (GPL, MIT, Apache, BSD) or officially authorized for free redistribution.
          </p>
        </div>

        <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base text-white">No Copyrighted APKs</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            We store public release metadata and direct links to official releases without hosting copyrighted proprietary code.
          </p>
        </div>

        <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-base text-white">Privacy First</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            No mandatory user registration, no tracking telemetry, no invasive ad networks. Browse and download freely.
          </p>
        </div>

      </div>

      {/* Developer Submission CTA */}
      <div className="bg-gradient-to-r from-green-950/80 via-[#12161F] to-green-950/80 border border-green-500/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-2xl font-extrabold text-white">Submit Your App</h2>
          <p className="text-xs md:text-sm text-gray-300">
            Have you created an open-source Android app or maintain a FOSS repository? Submit your project metadata and APK release link to be listed on Aryan App Store.
          </p>
        </div>
        <button
          onClick={onOpenSubmitModal}
          className="flex-shrink-0 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full shadow-lg shadow-green-500/20 transition-all text-sm"
        >
          Submit App Now
        </button>
      </div>

      {/* FAQ Accordion */}
      <section className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-green-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#1A1F2B] border border-gray-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between gap-3 focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-green-400 text-lg font-mono">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-gray-300 border-t border-gray-800 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-500 pt-4 space-y-1">
        <p>Aryan App Store • Built with React, TypeScript, Tailwind CSS & Firebase</p>
        <p>All app logos, trademarks, and source code belong to their respective open-source developers.</p>
      </div>

    </div>
  );
};
