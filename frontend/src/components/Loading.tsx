interface LoadingProps {
  name: string;
}

export default function Loading({name}: LoadingProps) {
  return (
    <div className="flex items-center justify-center py-10 space-x-3 animate-fadeIn">
      <svg
        className="w-8 h-8 text-blue-600 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <div className="text-sm text-gray-600 font-medium tracking-wide animate-pulse">
        {name}
      </div>
    </div>
  );
}
