import React, { useRef, useEffect, useState } from 'react';

const VisualizationCanvas = ({ visualizationData }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef(null);

  // Debug and auto-play when new data arrives
  useEffect(() => {
    console.log('📊 Visualization Data:', visualizationData);
    if (visualizationData && visualizationData.layers) {
      console.log('🔍 Layers details:');
      visualizationData.layers.forEach((layer, index) => {
        console.log(`   Layer ${index}:`, layer);
      });
      
      // Auto-play when new visualization data arrives
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [visualizationData]);

  // Simple canvas test
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(10, 10, 50, 50);
      console.log('✅ Canvas test: Drew green square');
    }
  }, []);

  useEffect(() => {
    if (!visualizationData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Clear canvas with dark background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isPlaying) {
      startAnimation();
    } else {
      drawFrame(currentTime);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visualizationData, isPlaying, currentTime]);

  const drawFrame = (time) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear with dark background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!visualizationData || !visualizationData.layers) return;

    visualizationData.layers.forEach(layer => {
      drawLayer(ctx, layer, time);
    });
  };

  const drawLayer = (ctx, layer, time) => {
    const { type, props = {}, animations = [] } = layer;
    
    // Calculate animated properties with defaults
    const animatedProps = { 
      x: props.x || 100,
      y: props.y || 100,
      r: props.r || 20,
      fill: props.fill || '#3498db',
      ...props 
    };
    
    animations.forEach(anim => {
      if (time >= (anim.start || 0) && time <= (anim.end || 3000)) {
        const progress = (time - (anim.start || 0)) / ((anim.end || 3000) - (anim.start || 0));
        const from = anim.from !== undefined ? anim.from : animatedProps[anim.property];
        const to = anim.to !== undefined ? anim.to : from + 100;
        
        animatedProps[anim.property] = from + (to - from) * progress;
      }
    });

    // Draw based on type
    switch (type) {
      case 'circle':
        drawCircle(ctx, animatedProps);
        break;
      case 'rectangle':
        drawRectangle(ctx, animatedProps);
        break;
      case 'arrow':
        drawArrow(ctx, animatedProps);
        break;
      case 'text':
        drawText(ctx, animatedProps);
        break;
      case 'orbit':
        drawOrbit(ctx, layer, time);
        break;
      default:
        console.warn('Unknown layer type:', type);
        drawCircle(ctx, animatedProps);
    }
  };

  const drawCircle = (ctx, props) => {
    ctx.beginPath();
    ctx.arc(props.x, props.y, props.r, 0, 2 * Math.PI);
    ctx.fillStyle = props.fill || '#3498db';
    ctx.fill();
    if (props.stroke) {
      ctx.strokeStyle = props.stroke;
      ctx.lineWidth = props.strokeWidth || 2;
      ctx.stroke();
    }
  };

  const drawRectangle = (ctx, props) => {
    ctx.fillStyle = props.fill || '#3498db';
    ctx.fillRect(props.x, props.y, props.width || 40, props.height || 40);
    if (props.stroke) {
      ctx.strokeStyle = props.stroke;
      ctx.lineWidth = props.strokeWidth || 2;
      ctx.strokeRect(props.x, props.y, props.width || 40, props.height || 40);
    }
  };

  const drawArrow = (ctx, props) => {
    const { x = 100, y = 100, dx = 50, dy = 0, color = '#e74c3c', headLength = 10 } = props;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(
      x + dx - headLength * Math.cos(angle - Math.PI / 6),
      y + dy - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x + dx - headLength * Math.cos(angle + Math.PI / 6),
      y + dy - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawText = (ctx, props) => {
    const { x = 100, y = 100, text = 'Text', fontSize = 16, fill = '#ffffff' } = props;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  };

  const drawOrbit = (ctx, layer, time) => {
    const { props = {}, animations = [] } = layer;
    const { centerX = 300, centerY = 200, radius = 100, fill = '#3498db' } = props;
    
    animations.forEach(anim => {
      if (anim.property === 'orbit') {
        const progress = time / (anim.duration || 4000);
        const angle = progress * 2 * Math.PI;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, props.r || 15, 0, 2 * Math.PI);
        ctx.fillStyle = fill;
        ctx.fill();
        
        // Draw orbit path
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  };

  const startAnimation = () => {
    let startTime = null;
    const duration = visualizationData.duration || 4000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCurrentTime(progress * duration);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setIsPlaying(true);
      startAnimation();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawFrame(0);
  };

  if (!visualizationData) {
    return (
      <div className="visualization-placeholder">
        <div className="placeholder-content">
          <p>🚀 Visualizations will appear here</p>
          <p>Ask a question to see animations!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visualization-container">
      <canvas
        ref={canvasRef}
        className="visualization-canvas"
        width={600}
        height={400}
      />
      <div className="visualization-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={handleReset}>🔄 Reset</button>
        <span className="time-display">
          {Math.round(currentTime / 100) / 10}s / {visualizationData.duration / 1000}s
        </span>
      </div>
    </div>
  );
};

export default VisualizationCanvas;