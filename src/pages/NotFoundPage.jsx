import { Link } from "react-router-dom";
import { isAuthenticated } from "@/api/storage";
import { ROUTES } from "@/constants/routes";

const NotFoundPage = () => {
  const destination = isAuthenticated() ? ROUTES.posts : ROUTES.login;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-5 text-center">
      <section className="w-full max-w-[360px] rounded-xl bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <p className="text-sm font-semibold text-[#b71422]">404</p>
        <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#191c1d]">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-2 text-sm leading-5 text-[#5f5e5e]">
          요청한 경로가 없거나 이동되었습니다.
        </p>
        <Link
          to={destination}
          className="mt-6 flex h-11 items-center justify-center rounded-full bg-[#b71422] text-sm font-semibold text-white"
        >
          <span style={{ color: "#ffffff" }}>돌아가기</span>
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
