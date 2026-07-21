import { Link } from "react-router-dom";

const FixedActionBar = ({
  cancelLabel = "취소하기",
  cancelTo,
  isSubmitting = false,
  isSubmitDisabled = false,
  submitLabel,
  submittingLabel = "처리 중...",
}) => {
  return (
    <div className="mt-0 flex w-full gap-1">
      <Link
        to={cancelTo}
        className="flex h-12 flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#b71422] text-base font-bold leading-6 text-[#b71422] [color:#b71422] transition hover:bg-[#ffdad7]/40 active:scale-[0.97]"
      >
        <span style={{ color: "#b71422", fontWeight: 700 }}>
          {cancelLabel}
        </span>
      </Link>
      <button
        type="submit"
        form="postForm"
        className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#9c2600] text-base font-bold leading-6 text-white transition hover:bg-[#721c00] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-55"
        disabled={isSubmitDisabled || isSubmitting}
      >
        <span style={{ color: "#ffffff", fontWeight: 800 }}>
          {isSubmitting ? submittingLabel : submitLabel}
        </span>
      </button>
    </div>
  );
};

export default FixedActionBar;
