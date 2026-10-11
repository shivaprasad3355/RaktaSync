
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Droplet,
  HeartPulse,
  ShieldCheck,
  Users,
  Menu,
  X,
} from "lucide-react";
import "./App.css";
import BloodScene from "./BloodScene.jsx";

export default function App() {
  const [splash, setSplash] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="rakta-app">
      <div className="background-3d" aria-hidden="true">
        <div className="bg-orb bg-orb-one" />
        <div className="bg-orb bg-orb-two" />
        <div className="bg-orb bg-orb-three" />

        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="bg-particle"
            style={{
              "--i": i,
              "--x": `${(i * 37 + 11) % 100}%`,
              "--y": `${(i * 53 + 7) % 100}%`,
              "--size": `${2 + (i % 4)}px`,
              "--duration": `${8 + (i % 7)}s`,
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {splash && (
          <motion.div
            className="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="splash-drop"
              animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Droplet size={78} fill="#e51c35" strokeWidth={1.5} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Rakta<span>Sync</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              EVERY DROP CONNECTS A LIFE
            </motion.p>
            <div className="loading-track">
              <motion.div
                className="loading-progress"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="navbar">
        <button className="brand" onClick={() => scrollTo("home")}>
          <span className="brand-icon"><HeartPulse size={24} /></span>
          Rakta<span className="brand-red">Sync</span>
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("process")}>How it works</button>
          <button className="nav-cta" onClick={() => scrollTo("join")}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-grid" />

        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <div className="eyebrow">
            <span className="live-dot" />
            BGSCET BLOOD DONATION NETWORK
          </div>

          <h1>
            One Drop.
            <br />
            Infinite <span className="text-glow">Hope.</span>
          </h1>

          <p className="hero-description">
            Connecting student donors with people who need blood.
            One community, one connection, one life at a time.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => scrollTo("join")}>
              Join the Network <ArrowRight size={18} />
            </button>
            <button className="secondary-btn" onClick={() => scrollTo("process")}>
              <Activity size={18} /> Explore the Process
            </button>
          </div>

          <div className="trust-row">
            <ShieldCheck size={27} />
            <div>
              <strong>Campus-focused network</strong>
              <span>Designed for verified student participation</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <motion.div
            className="main-drop"
            animate={{ y: [0, -13, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            <Droplet size={140} fill="#b50924" strokeWidth={1.2} />
            <HeartPulse className="drop-heart" size={35} />
          </motion.div>

          <div className="float-card card-top">
            <HeartPulse size={25} />
            <div><small>THE POWER OF GIVING</small><strong>Be someone's hope</strong></div>
          </div>

          <div className="float-card card-left">
            <span className="blood-type">O+</span>
            <div><strong>Blood groups</strong><small>Smart donor matching</small></div>
          </div>

          <div className="float-card card-right">
            <ShieldCheck size={27} />
            <div><strong>Verified students</strong><small>Campus community</small></div>
          </div>

          <div className="platform"><div className="platform-ring" /></div>
        </motion.div>

        <div className="hero-bottom">
          <span>BUILT FOR OUR CAMPUS</span>
          <span className="bottom-line" />
          <span>TECHNOLOGY WITH A HUMAN HEART</span>
        </div>
      </section>

      <section className="content-section" id="about">
        <div className="section-heading">
          <span className="section-tag">WHY RAKTASYNC</span>
          <h2>Every second matters.<br /><span>Every connection counts.</span></h2>
          <p>A campus-focused system designed to simplify emergency blood requests and donor communication.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <Users size={28} />
            <h3>Verified Community</h3>
            <p>Organize registered student donor profiles in one place.</p>
          </article>
          <article className="feature-card">
            <Droplet size={28} />
            <h3>Smart Matching</h3>
            <p>Find potentially compatible donors using blood group data.</p>
          </article>
          <article className="feature-card">
            <Activity size={28} />
            <h3>Rapid Alerts</h3>
            <p>Coordinate emergency requests and collect donor responses.</p>
          </article>
        </div>
      </section>

      <section className="content-section process-section" id="process">
        <div className="section-heading">
          <span className="section-tag">SIMPLE. CONNECTED. MEANINGFUL.</span>
          <h2>How RaktaSync works</h2>
          <p>Four steps to connect an emergency request with potential donors.</p>
        </div>

        <div className="steps-grid">
          {[
            ["01", "Register", "Students create profiles and provide their blood group."],
            ["02", "Request", "A requester submits blood requirements and hospital details."],
            ["03", "Connect", "The system finds matching profiles and sends notifications."],
            ["04", "Respond", "Donors respond and the requester coordinates next steps."],
          ].map(([number, title, description]) => (
            <article className="step-card" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section" id="join">
        <HeartPulse size={40} className="cta-icon" />
        <span className="section-tag">YOUR COMMUNITY NEEDS YOU</span>
        <h2>Be the reason someone gets another tomorrow.</h2>
        <p>Take the first step toward building a stronger campus blood donation community.</p>
        <button className="primary-btn" onClick={() => alert("Registration will be connected to the backend in a later step.")}>
          Join RaktaSync <ArrowRight size={18} />
        </button>
      </section>

      <footer className="footer">
        <div className="footer-brand"><HeartPulse size={20} /> Rakta<span>Sync</span></div>
        <p>Built with purpose. Connected by compassion.</p>
        <span>© {new Date().getFullYear()} RaktaSync · BGSCET Demo</span>
      </footer>
    </main>
  );
}
