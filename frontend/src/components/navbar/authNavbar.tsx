import Logo from '@/assets/logo/Fx.png'

export const AuthNavbar: React.FC = () => {
  return (
    <div className="w-full min-w-[100vw] h-[85px] px-5 py-4 flex justify-start items-center lg:hidden bg-[var(--light-foreground)] ">
      <img src={Logo} alt="logo" className="max-h-[80px] h-full shrink-0" />
    </div>
  );
};
