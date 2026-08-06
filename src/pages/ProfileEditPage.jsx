import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, clearAuthSession, getAccessToken, userApi } from "@/api";
import ConfirmModal from "@/components/common/ConfirmModal";
import Toast from "@/components/common/Toast";
import { ROUTES } from "@/constants/routes";
import PasswordForm from "@/features/profile/PasswordForm";
import ProfileForm from "@/features/profile/ProfileForm";
import WithdrawSection from "@/features/profile/WithdrawSection";
import { normalizeMyProfile } from "@/utils/normalizers";
import Icon from "@/components/common/Icon";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const showToast = useCallback((message) => {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2000);
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate(ROUTES.login, { replace: true });
      return;
    }

    let isCancelled = false;

    const fetchProfile = async () => {
      try {
        const response = await userApi.getMyProfile();

        if (!isCancelled) {
          setProfile(normalizeMyProfile(response.data));
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);

    try {
      await userApi.deleteMe();
      clearAuthSession();
      navigate(ROUTES.login, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsWithdrawing(false);
      setIsWithdrawModalOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authApi.signout();
    } catch {
      // 서버 로그아웃 실패 시에도 로컬 세션은 정리합니다.
    } finally {
      clearAuthSession();
      setIsLoggingOut(false);
      navigate(ROUTES.login, { replace: true });
    }
  };

  return (
    <main className="min-h-[calc(100vh-7rem)] px-4 pb-4 pt-10">
      <section className="mx-auto w-full max-w-[392px]">
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold leading-8 text-[#191c1d]">
            프로필 정보를
            <br />
            수정할 수 있어요
          </h2>
          {/* <p className="mt-1 text-base leading-6 text-[#5f5e5e]">
            프로필 정보와 비밀번호를 변경할 수 있습니다.
          </p> */}
        </div>

        {isLoading && (
          <div className="rounded-xl bg-white p-6 text-center text-[#5f5e5e] shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            프로필 정보를 불러오는 중입니다.
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="mb-4 rounded-xl border border-[#e4beba] bg-white p-4 text-sm text-[#ba1a1a]">
            {errorMessage}
          </div>
        )}

        {!isLoading && profile && (
          <>
            <ProfileForm
              profile={profile}
              onProfileUpdated={setProfile}
              onToast={showToast}
            />
            <PasswordForm onToast={showToast} />
            <button
              type="button"
              className="mx-auto mt-5 flex h-10 w-fit min-w-[104px] items-center justify-center gap-1.5 rounded-full bg-[#b71422] px-5 text-xs font-bold leading-4 text-white transition hover:bg-[#930014] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              <Icon className="text-[18px] text-white [color:#ffffff]">
                logout
              </Icon>
              <span
                className="text-white [color:#ffffff]"
                style={{ fontSize: "12px", fontWeight: 800 }}
              >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
              </span>
            </button>
            <WithdrawSection onWithdraw={() => setIsWithdrawModalOpen(true)} />
          </>
        )}
      </section>

      <Toast message={toastMessage} />

      <ConfirmModal
        isOpen={isWithdrawModalOpen}
        title="회원탈퇴 하시겠습니까?"
        description="작성된 게시글과 댓글은 삭제되지 않을 수 있습니다."
        confirmLabel="확인"
        cancelLabel="취소"
        isConfirming={isWithdrawing}
        onCancel={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
      />
    </main>
  );
};

export default ProfileEditPage;
