const WithdrawSection = ({ onWithdraw }) => {
  return (
    <button
      type="button"
      className="mt-4 flex h-5 w-fit cursor-pointer items-center justify-start text-left font-normal text-[#a9a9a9] underline"
      onClick={onWithdraw}
    >
      <span style={{ fontSize: "11px", fontWeight: 400 }}>탈퇴하기</span>
    </button>
  );
};

export default WithdrawSection;
