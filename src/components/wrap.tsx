import React from 'react';

/**
 * 异步路由动画第一次无法加载解决方案
 * @param WrappedComponent React.ComponentClass
 * @returns {function(): React.ComponentClass}
 */
export const wrap = (WrappedComponent: React.ComponentClass) => {
  return function w(): React.ReactNode {
    return (
      <div className="wrap-container">
        <WrappedComponent />
      </div>
    );
  };
};
