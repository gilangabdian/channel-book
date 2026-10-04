import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kiri: Brand, Copyright & Social */}
          <div className="md:col-span-2 flex flex-col space-y-2">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Channel</h2>
              <p className="text-xs text-neutral-500 mt-2">© 2026 Channel. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <span className="sr-only">X (Twitter)</span>
                {/* X (formerly Twitter) Logo */}
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Tengah: Channel Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-neutral-900">Channel</h3>
            <ul className="flex flex-col">
              <li>
                <Link href="/about" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Kanan: Legal Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-neutral-900">Legal</h3>
            <ul className="flex flex-col">
              <li>
                <Link href="/terms" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Terms & Services
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
