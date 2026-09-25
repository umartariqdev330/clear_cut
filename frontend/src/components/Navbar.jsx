import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="logo-link">
          <div className="navbar__logo-icon">
            <Sparkles size={20} />
          </div>
          <span className="navbar__logo-text">ClearCut</span>
        </Link>

        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>Home</Link>
          <Link to="/app" className={`navbar__link ${location.pathname === '/app' ? 'navbar__link--active' : ''}`}>Tool</Link>
          <a href="#features" className="navbar__link">Features</a>

        </div>

        <div className="navbar__actions">
          <Link to="/app" className="navbar__cta" id="nav-cta">
            Get Started Free
          </Link>
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${mobileOpen ? 'navbar__mobile--open' : ''}`}>
        <Link to="/" className="navbar__mobile-link">Home</Link>
        <Link to="/app" className="navbar__mobile-link">Tool</Link>
        <a href="#features" className="navbar__mobile-link">Features</a>

        <Link to="/app" className="navbar__mobile-cta">Get Started Free</Link>
      </div>
    </nav>
  )
}
