import { MapPin, Mail, Youtube, Instagram, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-16 px-8 mt-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm leading-relaxed">

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-50 mb-3 text-base">Quick Links</h3>
          <a href="/about-us" className="block hover:text-red-500 transition">About Us</a>
          <a href="/career" className="block hover:text-red-500 transition">Career</a>
          <a href="/blogs" className="block hover:text-red-500 transition">Blogs</a>
          <a href="/contact-us" className="block hover:text-red-500 transition">Contact Us</a>
          <a href="/terms-of-use" className="block hover:text-red-500 transition">Terms of Use</a>
          <a href="/privacy-policy" className="block hover:text-red-500 transition">Privacy Policy</a>
        </div>

        {/* Our Services Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-50 mb-3 text-base">Our Services</h3>
          <a href="/services/web" className="block hover:text-red-500 transition">Web Development</a>
          <a href="/services/mobile" className="block hover:text-red-500 transition">Mobile Development</a>
          <a href="/services/curriculum" className="block hover:text-red-500 transition">Digital Curriculum Development</a>
          <a href="/services/offshore" className="block hover:text-red-500 transition">Offshore Development Center</a>
          <a href="/services/consultancy" className="block hover:text-red-500 transition">Consultancy Services</a>
          <a href="/services/data-science" className="block hover:text-red-500 transition">Data Science</a>
          <a href="/services/cloud" className="block hover:text-red-500 transition">Cloud Services</a>
          <a href="/services/security" className="block hover:text-red-500 transition">Data Security & Backup</a>
          <a href="/services/bulk-sms" className="block hover:text-red-500 transition">Bulk SMS</a>
        </div>

        {/* Our Products Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-50 mb-3 text-base">Our Product</h3>
          <a href="/products/online-exam" className="block hover:text-red-500 transition">Online Examination System</a>
          <a href="/products/gudschools" className="block hover:text-red-500 transition">GudSchools</a>
          <a href="/products/admission" className="block hover:text-red-500 transition">Online Admissions System</a>
          <a href="/products/erp" className="block hover:text-red-500 transition">Schools / College / University Management System</a>
          <a href="/products/college-erp" className="block hover:text-red-500 transition">Autonomous College Management System</a>
          <a href="/products/visitor" className="block hover:text-red-500 transition">Visitor Vendor Management System</a>
          <a href="/products/curriculum-dev" className="block hover:text-red-500 transition">Online Curriculum Development</a>
          <a href="/products/thesis" className="block hover:text-red-500 transition">Online PhD Thesis Processing</a>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-5">
          <h3 className="font-semibold text-neutral-50 mb-4 text-base">Contact Info</h3>
          <div className="flex items-start gap-4">
            <MapPin size={24} className="text-white mt-1 shrink-0" />
            <div>
              <p className="font-medium text-neutral-100 mb-1">Bynaric Systems Pvt Ltd.</p>
              <p className="text-xs leading-5">Office No. 1022, 10th Floor, Solitaire<br />Business Hub Balewadi High<br />Street, Baner Pune Maharashtra<br />411045</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail size={24} className="text-white mt-1 shrink-0" />
            <div>
              <p className="font-medium text-neutral-100 mb-1">Email:</p>
              <a href="mailto:info@bynaric.in" className="text-xs hover:text-red-500">info@bynaric.in</a>
            </div>
          </div>
        </div>

      </div>

      {/* Social Media & Sub-Footer */}
      <div className="border-t border-neutral-700/50 mt-16 pt-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-neutral-500 uppercase tracking-widest">

        {/* Social Icons */}
        <div className="flex items-center gap-5 text-neutral-600">

          <a href="https://www.instagram.com/bynaric_systems_pvt_ltd/" className="hover:text-pink-600 transition"><Instagram size={22} /></a>
          <a href="https://www.linkedin.com/uas/login?session_redirect=%2Fcompany%2F74949327" className="hover:text-sky-600 transition"><Linkedin size={22} /></a>
          <a href="https://www.facebook.com/BynaricSystems" className="hover:text-blue-600 transition"><Facebook size={22} /></a>
        </div>

        {/* Copyright */}
        <div className="text-center  md:text-left">
          © 2026 Bynaric All Rights Reserved.
        </div>



      </div>
    </footer>
  );
};

export default Footer;