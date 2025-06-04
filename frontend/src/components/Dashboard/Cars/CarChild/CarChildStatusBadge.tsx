interface Props {
  status: number;
}

export const StatusBadge = ({colorClass, statusText}) => {
  return (
    <div
      className={`inline-block ${colorClass} text-white text-sm font-medium px-3 py-1 rounded-full shadow-md`}
    >
      {statusText}
    </div>
  );
}

export default function CarChildStatusBadge({ status }: Props) {
  let statusText = "";
  let colorClass = "";

  switch (status) {
    case 1:
      statusText = "Active";
      colorClass = "bg-green-600";
      break;
    case 2:
      statusText = "Maintenance";
      colorClass = "bg-yellow-600";
      break;
    case 3:
      statusText = "Used By Owner";
      colorClass = "bg-purple-600";
      break;
    case 4:
      statusText = "Inactive";
      colorClass = "bg-gray-400";
      break;
    case 5:
      statusText = "Reserved";
      colorClass = "bg-red-400";
      break;
    default:
      break;
  }

  return (
    <StatusBadge colorClass={colorClass} statusText={statusText}/>
  );
}
