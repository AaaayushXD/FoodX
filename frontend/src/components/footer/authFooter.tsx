export const AuthFooter: React.FC = () => {
    return (
      <div className="w-full text-[13px] sm:text-[16px] max-h-[60px] h-full py-5">
        <p className="text-[var(--dark-secondary-text)] w-full text-center">
          Designed and Developed by{" "}
          <a target="_blank" href="https://saroj-gt.web.app/" className="hover:underline hover:text-[var(--primary-color)] cursor-pointer">
            Saroj
          </a>{" "}
          and{" "}
          <a target="_blank" href="https://aayush-al.web.app/" className="hover:underline hover:text-[var(--primary-color)] cursor-pointer">
            Aayush
          </a>
        </p>
      </div>
    );
  };
  