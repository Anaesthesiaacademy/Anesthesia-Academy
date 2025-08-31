'use client';

export default function PrimaryButton({ type = 'button', onClick, children, className = '', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full transition cursor-pointer ${className} disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transform ease-in-out duration-300 `}
      {...props}
    >
      {children}
    </button>
  );
}

