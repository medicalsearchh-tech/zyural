// frontend/src/feature-module/learn/learn.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const LearnFeature: React.FC = () => {
  return (
    <div className="learn-feature">
      <Outlet />
    </div>
  );
};

export default LearnFeature;