import React from 'react';
import './Hero.css';
import FeaturesCarousel from './FeaturesCarousel/FeaturesCarousel';
import AnimatedBackground from './AnimatedBackground/AnimatedBackground';

const Hero: React.FC = () => {
  return (
    <>
      <AnimatedBackground />
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-headline">
                A capital app for independents
              </h1>
              <p className="hero-subheadline">
                Get paid faster and manage your finances effortlessly. Perfect for freelancers seeking a seamless financial solution.
              </p>
              <button className="hero-cta">
                Join today
              </button>
            </div>
            
            <div className="hero-visual">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="phone-header">
                    <div className="status-bar">
                      <span className="time">9:41</span>
                      <div className="signal-battery">
                        <span className="signal">●●●</span>
                        <span className="battery">100%</span>
                      </div>
                    </div>
                  </div>
                  <div className="app-content">
                    <h2 className="app-title">Finanzas</h2>
                    <div className="visa-card">
                      <div className="card-info">
                        <span className="visa-logo">VISA</span>
                        <span className="card-number">●●●● 4851</span>
                      </div>
                    </div>
                    <div className="integration-message">
                      <p>Gestiona tus finanzas con un toque</p>
                      <div className="tap-indicator">
                        <div className="tap-circle"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturesCarousel />
    </>
  );
};

export default Hero;
