import { ExternalLink, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3 className="footer__logo">ClearCut</h3>
            <p className="footer__tagline">
              AI-powered background removal for everyone. Fast, free, and pixel-perfect.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Product</h4>
            <Link to="/app" className="footer__link">Background Remover</Link>
            <a href="#features" className="footer__link">Features</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <a href="#" className="footer__link">About</a>
            <a href="#" className="footer__link">Blog</a>
            <a href="#" className="footer__link">Careers</a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Legal</h4>
            <a href="#" className="footer__link">Privacy Policy</a>
            <a href="#" className="footer__link">Terms of Service</a>
            <a href="#" className="footer__link">Cookie Policy</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} ClearCut. All rights reserved.
          </p>
          <div className="footer__socials">
            <a href="#" className="footer__social" aria-label="Website">
              <Globe size={18} />
            </a>
            <a href="#" className="footer__social" aria-label="External Link">
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
