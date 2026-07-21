import { NavLink } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Icon from "@/components/common/Icon";

const navigationItems = [
  {
    label: "홈",
    icon: "home",
    disabled: true,
  },
  {
    label: "게시판",
    icon: "forum",
    to: ROUTES.posts,
    matches: (pathname) => pathname.startsWith("/posts"),
  },
  {
    label: "북마크",
    icon: "bookmark",
    disabled: true,
  },
  {
    label: "마이페이지",
    icon: "person",
    to: ROUTES.profileEdit,
    matches: (pathname) => pathname.startsWith("/profile"),
  },
];

const baseClass =
  "flex min-w-[64px] flex-col items-center justify-center rounded-full px-2 py-1 transition active:scale-90";

const navIconClass = "flex h-6 w-6 items-center justify-center text-[24px] leading-none";

const navLabelClass =
  "mt-0.5 block h-4 whitespace-nowrap text-center text-[12px] font-semibold leading-4";

const BottomNavigation = () => {
  const activeColor = "#b71422";

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-[150] flex min-h-[72px] w-full max-w-[430px] -translate-x-1/2 items-center justify-around rounded-t-xl bg-[#f8f9fa]/90 px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] backdrop-blur-xl"
      aria-label="하단 메뉴"
    >
      {navigationItems.map((item) => {
        if (item.disabled) {
          return (
            <button
              key={item.label}
              type="button"
              className={`${baseClass} cursor-default text-[#5f5e5e]`}
              aria-label={item.label}
              disabled
            >
              <Icon className={navIconClass}>{item.icon}</Icon>
              <span className={navLabelClass}>{item.label}</span>
            </button>
          );
        }

        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `${baseClass} group ${isActive ? "" : "text-[#5f5e5e]"}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`${navIconClass} ${
                    isActive ? "" : "group-hover:text-[#b71422]"
                  }`}
                  filled={isActive}
                  style={isActive ? { color: activeColor } : undefined}
                >
                  {item.icon}
                </Icon>
                <span
                  className={`${navLabelClass} ${
                    isActive ? "" : "group-hover:text-[#b71422]"
                  }`}
                  style={isActive ? { color: activeColor } : undefined}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
