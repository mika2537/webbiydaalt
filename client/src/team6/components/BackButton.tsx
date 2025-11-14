import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: "link" | "button";
}

/**
 * Reusable back button component with smart navigation
 * - Uses browser history by default (navigate(-1))
 * - Falls back to specified path if provided
 * - Supports both link and button styles
 */
export default function BackButton({
  to,
  label = "Буцах",
  className = "",
  variant = "button",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    // Always use browser history to go to previous page
    // This ensures user goes back exactly where they came from
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
