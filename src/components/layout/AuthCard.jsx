import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Icon from "@/components/common/Icon";

const AuthCard = ({ activeTab, children }) => {
  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b71422] shadow-[0_8px_20px_rgba(183,20,34,0.22)]">
          <Icon className="text-[40px] text-white" filled>
            forum
          </Icon>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold leading-8 text-[#b71422]">
          환영합니다 ~
        </h1>
        <p className="mt-2 text-base leading-6 text-[#5f5e5e]">가입해보세요~</p>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-[#edeeef] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <nav className="flex border-b border-[#edeeef]" aria-label="로그인 및 회원가입">
          <NavLink
            to={ROUTES.login}
            className={`flex h-[53px] flex-1 items-center justify-center border-b-2 text-sm font-semibold tracking-[0.05em] transition hover:bg-[#fff8f8] hover:text-[#b71422] ${
              activeTab === "login"
                ? "border-[#b71422] text-[#b71422]"
                : "border-transparent text-[#5f5e5e]"
            }`}
          >
            로그인
          </NavLink>
          <NavLink
            to={ROUTES.signup}
            className={`flex h-[53px] flex-1 items-center justify-center border-b-2 text-sm font-semibold tracking-[0.05em] transition hover:bg-[#fff8f8] hover:text-[#b71422] ${
              activeTab === "signup"
                ? "border-[#b71422] text-[#b71422]"
                : "border-transparent text-[#5f5e5e]"
            }`}
          >
            회원가입
          </NavLink>
        </nav>

        <div className="p-5">{children}</div>
      </div>
    </>
  );
};

export default AuthCard;
