import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: "link" | "button";
}

export default function BackButton({
  to,
  label = "Буцах",
  className = "",
  variant = "button",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  if (variant === "link") {
    return (
      <button
        onClick={handleBack}
        className={`text-gray-600 hover:text-gray-900 inline-block ${className}`}
      >
        ← {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleBack}
      className={`px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium ${className}`}
    >
      {label}
    </button>
  );
}
