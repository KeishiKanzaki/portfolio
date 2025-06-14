import { AlertCircle } from "lucide-react";

type FormErrorProps = {
    message: string;
}

export const FormError = ({ message }: FormErrorProps) => {
    return (
        <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
    );
};