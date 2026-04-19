export default function Container({ children, className = "" }) {
  return (
    <div
      className={`
        w-full 
        max-w-[1400px] 
        mx-auto 
        px-4 sm:px-6 md:px-10 lg:px-16
        ${className}
      `}
    >
      {children}
    </div>
  );
}