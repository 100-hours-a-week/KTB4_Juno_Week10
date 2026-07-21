const PlaceholderPage = ({ title, legacyFile, responsibilities = [] }) => {
  return (
    <section className="mx-auto w-full max-w-[896px] px-5 pb-10 pt-24">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#9c2600]">Migration scaffold</p>
        <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold leading-[38px] text-[#191c1d]">
          {title}
        </h1>
        <p className="mt-2 text-base leading-6 text-[#5f5e5e]">
          {legacyFile} 기준으로 마이그레이션될 페이지입니다. 이번 단계에서는
          라우트와 공통 레이아웃만 연결했습니다.
        </p>
      </div>

      {responsibilities.length > 0 && (
        <ul className="space-y-2 rounded-lg border border-[#e7e8e9] bg-white p-5 text-sm text-[#5f5e5e] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
          {responsibilities.map((responsibility) => (
            <li key={responsibility}>- {responsibility}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PlaceholderPage;
