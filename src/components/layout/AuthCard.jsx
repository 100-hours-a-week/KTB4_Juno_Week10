import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const AuthCard = ({ activeTab, children }) => {
  return (
    <>
      <div className="mb-8 text-center">
        <div className="flex flex-col items-center">
          <img
            className="mb-3 h-[72px] w-[72px] rounded-3xl object-cover"
            src="/favicon.png"
            alt="마라보자"
          />
          <p className="mb-2 text-sm font-bold leading-5 text-[#c92525]">
            마라 소스 커뮤니티
          </p>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[36px] font-extrabold leading-[44px] tracking-normal text-[#191c1d]">
            마라보자
          </h1>
          <p className="mt-3 max-w-[300px] text-base font-medium leading-6 text-[#6b504c]">
            마라 소스, 그냥 먹지 말고
            <br />
            이것 저것 말아보자
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-[#edeeef] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        <nav
          className="flex border-b border-[#edeeef]"
          aria-label="로그인 및 회원가입"
        >
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
