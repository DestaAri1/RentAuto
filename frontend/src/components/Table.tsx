import { ReactNode } from "react";

interface TableProps {
  children?: ReactNode;
  className?: string;
  hover?: string;
}

const Table = ({ children }: TableProps) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  );
};

const TableHead = ({ children }: TableProps) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

const Th = ({
  children,
  className = "text-center text-xs font-medium text-gray-500 uppercase tracking-wider",
}: TableProps) => {
  return (
    <th scope="col" className={`px-4 py-3 ${className}`}>
      {children}
    </th>
  );
};

const TableBody = ({ children }: TableProps) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
  );
};

const Td = ({ children, className = "text-sm text-gray-500 text-center", hover = "" }: TableProps) => {
  return (
    <td className={`px-4 py-4 whitespace-nowrap ${className} ${hover}`}>{children}</td>
  );
};

export { Table, TableHead, Th, TableBody, Td };
