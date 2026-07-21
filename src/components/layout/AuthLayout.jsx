import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[430px] items-center justify-center overflow-hidden bg-[#f8f9fa] px-4 py-8 font-['Work_Sans'] text-[#191c1d]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ffdad7] opacity-55 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#ffdcc2] opacity-55 blur-[100px]" />
      <section className="relative z-10 w-full max-w-[398px]">
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
