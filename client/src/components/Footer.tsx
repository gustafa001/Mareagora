/**
 * Footer Component
 * 
 * Design: Maritime Professional
 * - Professional footer with links to important pages
 * - Contact information
 * - Copyright and legal links
 */

import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-maritime mb-4">MaréAgora</h3>
            <p className="text-sm text-gray-600">
              Tábua de marés confiável e acessível para o litoral brasileiro.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-gray-600 hover:text-maritime transition-colors">
                    Início
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-gray-600 hover:text-maritime transition-colors">
                    Blog
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-600 hover:text-maritime transition-colors">
                    FAQ
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre">
                  <a className="text-gray-600 hover:text-maritime transition-colors">
                    Sobre
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacidade">
                  <a className="text-gray-600 hover:text-maritime transition-colors">
                    Privacidade
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contato</h4>
            <p className="text-sm text-gray-600">
              <a
                href="mailto:contato@mareagora.com.br"
                className="text-maritime hover:underline"
              >
                contato@mareagora.com.br
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} MaréAgora. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
