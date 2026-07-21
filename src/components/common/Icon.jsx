const Icon = ({ children, filled = false, className = "", style }) => {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        ...style,
        ...(filled ? { fontVariationSettings: '"FILL" 1' } : {}),
      }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
};

export default Icon;
