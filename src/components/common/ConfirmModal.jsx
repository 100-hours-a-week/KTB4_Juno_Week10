const ConfirmModal = ({
  cancelLabel = "취소",
  confirmLabel = "확인",
  description,
  isConfirming = false,
  isOpen,
  onCancel,
  onConfirm,
  title,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-5">
      <section
        className="min-h-[220px] w-full max-w-[360px] rounded-xl bg-white px-6 pb-5 pt-12 text-center shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <h3
          id="confirm-modal-title"
          className="text-xl font-bold leading-7 text-[#191c1d]"
        >
          {title}
        </h3>
        {description && (
          <p className="mt-3 text-sm leading-5 text-[#5f5e5e]">{description}</p>
        )}
        <div className="mt-10 flex justify-center gap-1">
          <button
            type="button"
            className="h-10 min-w-[124px] rounded-full bg-[#f3f4f5] px-5 text-sm font-semibold text-[#5f5e5e] transition hover:bg-[#e7e8e9]"
            onClick={onCancel}
            disabled={isConfirming}
          >
            <span style={{ fontSize: "12px", fontWeight: 800 }}>
              {cancelLabel}
            </span>
          </button>
          <button
            type="button"
            className="h-10 min-w-[124px] rounded-full bg-[#b71422] px-5 text-sm font-semibold text-white transition hover:bg-[#930014] disabled:opacity-60"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            <span
              style={{ color: "#ffffff", fontSize: "12px", fontWeight: 800 }}
            >
              {isConfirming ? "처리 중..." : confirmLabel}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmModal;
