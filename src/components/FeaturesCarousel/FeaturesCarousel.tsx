import React, { useState, useEffect } from 'react';
import './FeaturesCarousel.css';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Control de Gastos",
    description: "Monitoree y categorice todos sus gastos de manera inteligente para mantener un control total de sus finanzas personales.",
    icon: "💰",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Gestión de Presupuesto",
    description: "Cree presupuestos personalizados y reciba alertas inteligentes para mantener sus metas financieras organizadas.",
    icon: "📊",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Gestión de Deuda",
    description: "Organice y priorice sus deudas con estrategias personalizadas para pagarlas de manera eficiente y planificada.",
    icon: "📋",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 4,
    title: "Cálculo de Intereses",
    description: "Calcule fácilmente los intereses y plazos de sus préstamos para tomar decisiones financieras informadas.",
    icon: "🧮",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 5,
    title: "Personalización de Tarjetas",
    description: "Diseñe sus tarjetas con colores, imágenes y estilos únicos que reflejen su personalidad y preferencias.",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop&crop=center"
  },
  {
    id: 6,
    title: "Seguridad Avanzada",
    description: "Congele instantáneamente su tarjeta desde la aplicación en caso de pérdida o uso no autorizado.",
    icon: "🔒",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop&crop=center"
  }
];

const FeaturesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);



  return (
    <section className="features-carousel">
      <div className="carousel-container">
        <div className="carousel-header">
          <h2 className="carousel-title">Nuestras Funcionalidades</h2>
          <p className="carousel-subtitle">Descubra las herramientas que transformarán su experiencia financiera</p>
        </div>
        
        <div className="carousel-track">
          <div 
            className="carousel-slides" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {features.map((feature) => (
              <div key={feature.id} className="carousel-slide">
                <div className="feature-card">
                  <div className="feature-image-container">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="feature-image"
                    />
                    <div className="feature-overlay">
                      <span className="feature-icon">{feature.icon}</span>
                    </div>
                  </div>
                  
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <button className="feature-button">
                      Conocer más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="carousel-navigation">
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentIndex + 1) / features.length) * 100}%` }}
              />
            </div>
            <div className="progress-info">
              <span className="current-slide">{currentIndex + 1}</span>
              <span className="slide-separator">de</span>
              <span className="total-slides">{features.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
