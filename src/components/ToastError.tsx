import { SetStateAction } from "react";
import { IoMdClose } from "react-icons/io";

type ErrorObjectProps = {
  isErr: boolean;
  message: string;
};
type ToastProps = {
  setErr: (value: SetStateAction<ErrorObjectProps>) => void;
  err: ErrorObjectProps;
};
export function ToastError({ setErr, err }: ToastProps) {
  return (
    <div className="m-auto border border-gray-100 shadow-md py-5 mb-5 w-1/2 rounded-sm relative">
      <IoMdClose
        className="absolute top-0.5 right-1 cursor-pointer"
        onClick={() => setErr({ isErr: false, message: "" })}
      />
      <p className="text-red-700 px-5">{err.message}</p>
    </div>
  );
}
