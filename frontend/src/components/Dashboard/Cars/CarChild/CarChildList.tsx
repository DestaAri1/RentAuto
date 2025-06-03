import { lazy, Suspense } from "react";
import { ParentCarChildList } from "./CarChildProps.tsx";
import Loading from "../../../Loading.tsx";

const CChildList = lazy(() => import("./CChildList.tsx"));

interface Props {
  route: string;
}

export default function CarChildList({ route }: Props) {
  return (
    <ParentCarChildList>
      <Suspense fallback={<Loading name="Load Car" />}>
        <CChildList route={route} />
      </Suspense>
    </ParentCarChildList>
  );
}
