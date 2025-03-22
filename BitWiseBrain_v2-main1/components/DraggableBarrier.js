import React, { useState, useEffect } from 'react';

function DraggableBarrier({ position, onPositionChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = e.target.closest('.container');
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Ensure barrier stays within container bounds
    const newPosition = Math.max(0, Math.min(x, container.offsetWidth - 10));
    onPositionChange(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className="draggable-barrier"
      style={{ left: position }}
      onMouseDown={handleMouseDown}
    />
  );
}

export default DraggableBarrier; 