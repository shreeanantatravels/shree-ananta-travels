"use client";
import { Mail, Plane } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Plane className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-gray-900 tracking-wider">
              Shree Ananta Travels
            </span>
          </div>

          {/* Contact */}
          <a
            href="mailto:info@anantatravel.com" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>info@anantatravel.com</span>
          </a>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
