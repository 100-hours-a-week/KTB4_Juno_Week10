import { useMemo, useState } from "react";
import { imageApi, userApi } from "@/api";
import Icon from "@/components/common/Icon";
import ProfileImagePicker from "@/features/auth/ProfileImagePicker";
import { getImageUrlFromResponse } from "@/utils/normalizers";
import { dispatchProfileUpdated } from "@/utils/profileEvents";
import {
  getProfileNicknameErrorMessage,
  isValidNickname,
} from "@/utils/validators";

const ProfileForm = ({ profile, onProfileUpdated, onToast }) => {
  const [nickname, setNickname] = useState(profile.nickname);
  const [profileImage, setProfileImage] = useState(profile.profileImage);
  const [selectedImage, setSelectedImage] = useState(null);
  const [helperMessage, setHelperMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return isValidNickname(nickname.trim());
  }, [nickname]);
  const hasProfileChanges = useMemo(() => {
    return Boolean(
      nickname.trim() !== profile.nickname ||
      selectedImage ||
      profileImage !== profile.profileImage,
    );
  }, [
    nickname,
    profile.nickname,
    profile.profileImage,
    profileImage,
    selectedImage,
  ]);
  const canSubmit = isFormValid && hasProfileChanges;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = getProfileNicknameErrorMessage(nickname);

    if (validationMessage) {
      setHelperMessage(validationMessage);
      return;
    }

    if (!hasProfileChanges) {
      return;
    }

    setIsSubmitting(true);
    setHelperMessage("");

    try {
      let nextProfileImage = profileImage;

      if (selectedImage) {
        const imageResponse = await imageApi.uploadImage(selectedImage);
        nextProfileImage = getImageUrlFromResponse(imageResponse);
      }

      const response = await userApi.updateMyProfile({
        nickname: nickname.trim(),
        profileImage: nextProfileImage,
      });
      const updatedProfileImage =
        response?.data?.profileImage ??
        response?.data?.profile_image ??
        nextProfileImage;

      setProfileImage(updatedProfileImage);
      setSelectedImage(null);
      const updatedProfile = {
        ...profile,
        nickname: nickname.trim(),
        profileImage: updatedProfileImage,
      };

      onProfileUpdated(updatedProfile);
      dispatchProfileUpdated(updatedProfile);
      onToast("프로필 정보가 수정되었습니다.");
    } catch (error) {
      setHelperMessage(`*${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-2"
      noValidate
      onSubmit={handleSubmit}
    >
      <section className="w-full rounded-xl bg-white px-5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center">
          <ProfileImagePicker
            currentImageUrl={profileImage}
            file={selectedImage}
            onChange={setSelectedImage}
            onRemove={() => {
              setProfileImage("");
              setSelectedImage(null);
            }}
            size="lg"
          />
        </div>

        <div className="mt-4 flex items-center gap-2 text-[#b71422]">
          <Icon className="text-[21px]">badge</Icon>
          <label
            className="text-sm font-semibold leading-5 tracking-[0.05em]"
            htmlFor="nickname"
          >
            닉네임 변경
          </label>
        </div>
        <input
          id="nickname"
          className="mt-4 h-14 w-full rounded-xl border-[1.5px] border-[#e4beba] bg-[#f8f9fa] px-4 text-lg leading-7 text-[#191c1d] transition focus:border-[#b71422] focus:shadow-[0_0_0_1px_#b71422]"
          value={nickname}
          onChange={(event) => {
            setNickname(event.target.value.slice(0, 11));
            setHelperMessage("");
          }}
        />
        <p className="mt-2 text-xs leading-4 text-[#5f5e5e]">
          공백 없이 10자 이하로 입력해주세요.
        </p>
        <p className="mt-1 min-h-[18px] text-xs leading-[18px] text-[#ba1a1a]">
          {helperMessage}
        </p>
        {profile.email && (
          <p className="mt-2 text-xs leading-4 text-[#5f5e5e]">
            이메일: {profile.email}
          </p>
        )}
        <button
          type="submit"
          className={`mt-6 flex h-10 w-fit min-w-[108px] items-center justify-center gap-1.5 rounded-full px-5 text-xs font-bold leading-4 text-white transition active:scale-[0.98] disabled:cursor-not-allowed ${
            canSubmit ? "bg-[#b71422] hover:bg-[#930014]" : "bg-[#c8c6c6]"
          }`}
          disabled={isSubmitting || !canSubmit}
        >
          <Icon className="text-[18px]">save</Icon>
          <span style={{ fontSize: "12px", fontWeight: 800 }}>
            {isSubmitting ? "변경 중..." : "프로필 변경하기"}
          </span>
        </button>
      </section>
    </form>
  );
};

export default ProfileForm;
