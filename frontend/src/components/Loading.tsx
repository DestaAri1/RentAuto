interface LoadingProps {
  name: string;
}

export default function Loading({ name }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce1"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce2"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce3"></span>
      </div>
      <p className="text-base text-gray-700 dark:text-gray-300 font-medium tracking-wide">
        {name}...
      </p>
    </div>
  );
}
