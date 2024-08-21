type ToastProps = {
  type: "success" | "error";
  message: string;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
const Toast = ({ type, message, onClose }: ToastProps) => {
  // Determine the background color based on the toast type
  const backgroundColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`relative p-4 rounded-lg shadow-lg w-fit m-auto text-white ${backgroundColor}`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 absolute top-0 right-1"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
