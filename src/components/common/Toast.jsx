const Toast = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-[#b71422] px-5 py-3 text-sm text-white shadow-[0_8px_20px_rgba(183,20,34,0.24)]"
      role="status"
    >
      {message}
    </div>
  );
};

export default Toast;
