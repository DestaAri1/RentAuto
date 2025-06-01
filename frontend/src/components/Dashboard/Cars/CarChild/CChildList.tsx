import { Link, useParams } from "react-router-dom";
import { Table, TableBody, TableHead, Td, Th } from "../../../Table.tsx";
import useCarChild from "../../../../hooks/useCarChild.tsx";
import { useEffect } from "react";
import CarChildStatusBadge from "./CarChildStatusBadge.tsx";
import CarChildAvailable from "./CarChildAvailable.tsx";

export default function CChildList() {
  const { slug } = useParams<{ slug: string }>();
  const { fetchCarChildren, carChildren, isFetched } = useCarChild();

  useEffect(() => {
    if (slug && !isFetched.current) {
      fetchCarChildren(slug);
    }
  }, [slug, fetchCarChildren, isFetched]);
  return (
    <>
      <Table>
        <TableHead>
          <tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Alias</Th>
            <Th>Status</Th>
            <Th>Color</Th>
            <Th>Available</Th>
            <Th className="relative">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </TableHead>
        <TableBody>
          {carChildren?.length > 0 ? (
            carChildren.map((car, index) => (
              <tr key={car.id}>
                <Td className="font-medium text-gray-900">{index + 1}</Td>
                <Td>{car.name}</Td>
                <Td>{car.alias}</Td>
                <Td><CarChildStatusBadge status={car.status}/></Td>
                <Td>{car.color}</Td>
                <Td><CarChildAvailable status={car.is_active}/></Td>
                <Td className="text-right text-sm font-medium">
                  <Link
                    to={"/"}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    VIEW
                  </Link>
                  <Link
                    to={"/"}
                    className="text-blue-600 hover:text-blue-900 ml-4"
                  >
                    UPDATE
                  </Link>
                  <button
                    // onClick={"/"}
                    className="text-red-600 hover:text-red-900 ml-4"
                    type="button"
                  >
                    DELETE
                  </button>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center px-6 py-4 text-sm text-gray-500"
              >
                No cars found.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </>
  );
}
