import { StatusBadge } from "./CarChildStatusBadge.tsx";

interface Props {
  status: boolean;
}

export default function CarChildAvailable({ status }:Props) {
  let statusText = "";
  let colorClass = "";

  switch (status) {
    case true:
      statusText = "Available";
      colorClass = "bg-green-600";
      break;
    case false:
      statusText = "Unavailable";
      colorClass = "bg-gray-400";
      break;
    default:
      break;
  }
  return <StatusBadge colorClass={colorClass} statusText={statusText} />;
}
