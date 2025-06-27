import Logo from '@/assets/logo/Fx.png'
import { useNavigate } from 'react-router-dom';

export const AuthNavbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-w-[100vw] h-[85px] px-5 py-4 flex justify-start items-center lg:hidden bg-[var(--light-foreground)] ">
      <img src={Logo} alt="logo" className="max-h-[80px] cursor-pointer h-full shrink-0" onClick={() => navigate("/")} />
    </div>
  );
};
