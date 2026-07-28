
function Button({
  children,
  onClick,
  variant = 'primary',
  width = 'auto',
  type = 'button',
  disabled = false,
  title
}){
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`btn btn-${variant} w-${width}`}
    >
      {children}
    </button>
  );
}

export default Button;
