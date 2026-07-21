import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getAccessToken,
  userApi,
} from "../api";
import ConfirmModal from "../components/common/ConfirmModal";
import Toast from "../components/common/Toast";
import { ROUTES } from "../constants/routes";
import PasswordForm from "../features/profile/PasswordForm";
import ProfileForm from "../features/profile/ProfileForm";
import WithdrawSection from "../features/profile/WithdrawSection";
import { normalizeMyProfile } from "../utils/normalizers";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const showToast = useCallback((message) => {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 2000);
  }, []);

  const loadProfile = useCallback(async () => {
    if (!getAccessToken()) {
      navigate(ROUTES.login, { replace: true });
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await userApi.getMyProfile();
      setProfile(normalizeMyProfile(response.data));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-[#f8f9fa] px-4 pb-4 pt-24">
      <section className="mx-auto w-full max-w-[392px]">
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold leading-8 text-[#191c1d]">
            회원정보 수정
          </h2>
          <p className="mt-1 text-base leading-6 text-[#5f5e5e]">
            프로필 정보와 비밀번호를 변경할 수 있습니다.
          </p>
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
