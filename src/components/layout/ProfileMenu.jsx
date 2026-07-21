import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi, clearAuthSession, getFullImageUrl, userApi } from "@/api";
import { ROUTES } from "@/constants/routes";
import { normalizeMyProfile } from "@/utils/normalizers";
import { subscribeProfileUpdated } from "@/utils/profileEvents";

const ProfileMenu = ({ variant = "board" }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    let ignore = false;

    userApi
      .getMyProfile()
      .then((response) => {
        if (ignore) {
          return;
        }

        const user = normalizeMyProfile(response?.data);
        setProfileImage(user.profileImage);
      })
      .catch(() => {
        if (!ignore) {
          setProfileImage("");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    return subscribeProfileUpdated((event) => {
      const updatedProfile = event.detail ?? {};

      if ("profileImage" in updatedProfile) {
        setProfileImage(updatedProfile.profileImage ?? "");
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.signout();
    } catch {
      // Legacy also logs out locally even when the server signout call fails.
    } finally {
      clearAuthSession();
      setIsOpen(false);
      navigate(ROUTES.login);
    }
  };

  const imageStyle = profileImage
    ? { backgroundImage: `url(${getFullImageUrl(profileImage)})` }
    : undefined;

  const menuTheme =
    variant === "profile"
      ? "border-[#e7e8e9] bg-white"
      : "border-[#e7e8e9] bg-white";
  const menuItemClass =
    "group flex h-[42px] items-center justify-center whitespace-nowrap bg-white px-4 text-center transition";
  const menuItemTextClass =
    "text-[12px] font-semibold leading-4 text-[#191c1d] group-hover:text-[#b71422]";
  const menuItemTextStyle = {
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: "16px",
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#e7e8e9] p-0"
        aria-label="회원 메뉴"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span
          className="block h-full w-full rounded-full bg-[#d9d9d9] bg-cover bg-center bg-no-repeat"
          style={imageStyle}
        />
      </button>

      {isOpen && (
        <nav
          className={`absolute right-0 top-12 z-50 flex w-[140px] flex-col overflow-hidden rounded-xl border shadow-[0_8px_24px_rgba(0,0,0,0.1)] ${menuTheme}`}
          aria-label="회원 메뉴"
        >
          <Link
            to={ROUTES.profileEdit}
            className={menuItemClass}
            onClick={() => setIsOpen(false)}
          >
            <span className={menuItemTextClass} style={menuItemTextStyle}>
              마이페이지
            </span>
          </Link>
          <button
            type="button"
            className={menuItemClass}
            onClick={handleLogout}
          >
            <span className={menuItemTextClass} style={menuItemTextStyle}>
              로그아웃
            </span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default ProfileMenu;
