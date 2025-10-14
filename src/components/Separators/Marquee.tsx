import React, { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  text: string;
  speed?: number;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  copyableText?: string;
  spacing?: number;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 1,
  backgroundColor = 'bg-black',
  textColor = 'text-white',
  className = '',
  copyableText,
  spacing = 200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Texto que se copiará, si no se proporciona, se usa el texto del marquee
  const textToCopy = copyableText || text;
  
  // Manejar la copia al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  };

  // Actualizar la posición del tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  // Efecto para configurar el contenido del marquee
  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return;
    
    // Calcular cuántas repeticiones necesitamos
    const calculateRepetitions = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      
      if (!container || !content) return;
      
      // Limpiar el contenido actual
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }
      
      // Crear el elemento de texto con espaciado
      const span = document.createElement('span');
      span.className = 'inline-block font-bold font-anek-latin';
      span.textContent = text;
      
      const spacer = document.createElement('span');
      spacer.className = 'inline-block';
      spacer.style.width = `${spacing}px`;
      spacer.innerHTML = '&nbsp;';
      
      const wrapper = document.createElement('div');
      wrapper.className = 'inline-flex items-center';
      wrapper.appendChild(span);
      wrapper.appendChild(spacer);
      
      // Añadir al contenido para medir
      content.appendChild(wrapper);
      
      // Calcular cuántas repeticiones necesitamos
      const itemWidth = wrapper.offsetWidth;
      const containerWidth = container.offsetWidth;
      
      // Necesitamos suficientes elementos para cubrir el contenedor más uno extra
      // para una transición fluida
      const requiredItems = Math.ceil(containerWidth / itemWidth) + 1;
      
      // Añadir los elementos adicionales
      for (let i = 1; i < requiredItems; i++) {
        const newWrapper = wrapper.cloneNode(true);
        content.appendChild(newWrapper);
      }
      
      // Configurar la animación usando CSS variables para mejor rendimiento
      content.style.setProperty('--marquee-width', `${itemWidth}px`);
      content.style.setProperty('--marquee-duration', `${Math.max(5, 20 / speed)}s`);
    };
    
    // Configuración inicial
    calculateRepetitions();
    
    // Recalcular cuando cambie el tamaño de la ventana
    const handleResize = () => {
      calculateRepetitions();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [text, spacing, speed]);
  
  // Actualizar estado de pausa
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.animationPlayState = isPaused ? 'paused' : 'running';
    }
  }, [isPaused]);
  
  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden ${backgroundColor} ${textColor} py-2 ${className} relative`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onMouseMove={handleMouseMove}
      onClick={isPaused ? copyToClipboard : undefined}
    > 
      <div 
        ref={contentRef}
        className="whitespace-nowrap marquee-animation"
        style={{
          display: 'inline-block',
          animationName: 'marquee',
          animationDuration: 'var(--marquee-duration)',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      />
      
      {/* Tooltip que sigue al cursor */}
      {isPaused && (
        <div 
          className="absolute bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 0}px`,
            transform: 'translateY(-50%)',
            opacity: 1,
          }}
        >
          {isCopied ? "Copied!" : "Click to copy"}
        </div>
      )}
    </div>
  );
};

export default Marquee;