import { lazy, Suspense } from 'react'
import { ParentCarChildList } from './CarChildProps.tsx'
import Loading from '../../../Loading.tsx';

const CChildList = lazy(() => import("./CChildList.tsx"));

export default function CarChildList() {
  return (
    <ParentCarChildList>
      <Suspense fallback={<Loading name="Load Car" />}>
        <CChildList />
      </Suspense>
    </ParentCarChildList>
  );
}
