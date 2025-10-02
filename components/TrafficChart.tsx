import React from 'react';

interface TrafficChartProps {
  data: number[]; // Array of numbers representing traffic speed
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  const width = 600;
  const height = 150;
  const maxVal = Math.max(...data, 1) * 1.2; // Add a buffer
  const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d / maxVal) * height;
      return `${x},${y}`;
  }).join(' ');

  const gradientId = "traffic-gradient";

  return (
    <div className="card">
      <h3 className="card-header">Live Traffic (kbps)</h3>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'var(--primary-color)', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: 'var(--primary-color)', stopOpacity: 0 }} />
          </linearGradient>
           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d={`M0,${height} ${points} ${width},${height}`} fill={`url(#${gradientId})`} />
        <polyline
          fill="none"
          stroke="var(--primary-color)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
          style={{ filter: 'url(#glow)', transition: 'all 0.5s linear' }}
        />
      </svg>
    </div>
  );
};

export default TrafficChart;
