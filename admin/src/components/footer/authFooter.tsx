export const AuthFooter: React.FC = () => {
  return (
    <div className="w-full max-h-[60px] py-5">
      <p className="text-[var(--dark-secondary-text)] w-full text-center">
        Designed and Developed by{" "}
        <span className="hover:underline hover:text-[var(--primary-color)] cursor-pointer">
          Saroj
        </span>{" "}
        and{" "}
        <span className="hover:underline hover:text-[var(--primary-color)] cursor-pointer">
          Aayush
        </span>
      </p>
    </div>
  );
};
