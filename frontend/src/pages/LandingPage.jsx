import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Upload,
  Wand2,
  Download,
  Zap,
  Shield,
  Palette,
  ImageOff,
  Layers,
  Clock,
  Star,
} from 'lucide-react'
import './LandingPage.css'

const features = [
  {
    icon: <Zap size={24} />,
    title: 'Lightning Fast',
    desc: 'Remove backgrounds in seconds with our optimized AI pipeline. No waiting, no queues.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Privacy First',
    desc: 'Images are processed locally and never stored on our servers. Your data stays yours.',
  },
  {
    icon: <Palette size={24} />,
    title: 'Custom Backgrounds',
    desc: 'Replace with solid colors or your own images. Perfect for product shots and portraits.',
  },
  {
    icon: <ImageOff size={24} />,
    title: 'Transparent Export',
    desc: 'Download clean PNG files with perfect alpha channels ready for any design tool.',
  },
  {
    icon: <Layers size={24} />,
    title: 'Batch Processing',
    desc: 'Process multiple images at once. Scale your workflow without breaking a sweat.',
  },
  {
    icon: <Clock size={24} />,
    title: 'No Signup Required',
    desc: 'Start removing backgrounds immediately. No accounts, no credit cards, no friction.',
  },
]

const steps = [
  {
    icon: <Upload size={28} />,
    title: 'Upload',
    desc: 'Drag & drop or click to upload your image. Supports PNG, JPG, and WebP.',
  },
  {
    icon: <Wand2 size={28} />,
    title: 'Process',
    desc: 'Our AI model detects the subject and removes the background with pixel-perfect precision.',
  },
  {
    icon: <Download size={28} />,
    title: 'Download',
    desc: 'Get your transparent PNG instantly. Optionally add a new background before downloading.',
  },
]



export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero__glow" />
        <div className="hero__mesh" />
        <div className="container hero__content">
          <div className="hero__badge animate-fade-in-up">
            <Star size={14} />
            <span>Trusted by 10,000+ creators</span>
          </div>
          <h1 className="hero__title animate-fade-in-up delay-1">
            Remove Image<br />
            Backgrounds <span className="hero__gradient-text">Instantly</span>
          </h1>
          <p className="hero__subtitle animate-fade-in-up delay-2">
            Powered by cutting-edge AI. Get professional, transparent results in seconds —
            no design skills required. Free forever.
          </p>
          <div className="hero__actions animate-fade-in-up delay-3">
            <Link to="/app" className="hero__cta-primary" id="hero-cta">
              Start Removing Backgrounds
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="hero__cta-secondary">
              See How It Works
            </a>
          </div>
          <div className="hero__stats animate-fade-in-up delay-4">
            <div className="hero__stat">
              <span className="hero__stat-value">10M+</span>
              <span className="hero__stat-label">Images Processed</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">&lt;3s</span>
              <span className="hero__stat-label">Avg. Processing</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">99.2%</span>
              <span className="hero__stat-label">Accuracy Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <span className="section-tag">Simple & Powerful</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-desc">Three simple steps to a perfect result</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div className={`step-card animate-fade-in-up delay-${i + 1}`} key={i}>
                <div className="step-card__number">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-card__icon">{step.icon}</div>
                <h3 className="step-card__title">{step.title}</h3>
                <p className="step-card__desc">{step.desc}</p>
                {i < steps.length - 1 && <div className="step-card__connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <span className="section-tag">Why ClearCut?</span>
            <h2 className="section-title">Built for Professionals</h2>
            <p className="section-desc">
              Everything you need for production-ready background removal
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className={`feature-card animate-fade-in-up delay-${(i % 3) + 1}`} key={i}>
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="final-cta__card animate-fade-in-up">
            <div className="final-cta__glow" />
            <h2 className="final-cta__title">Ready to Remove Backgrounds?</h2>
            <p className="final-cta__desc">
              Join thousands of creators, designers, and marketers who trust ClearCut.
            </p>
            <Link to="/app" className="final-cta__button" id="final-cta">
              Start Now — It's Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
