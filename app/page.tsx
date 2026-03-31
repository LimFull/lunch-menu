import { Suspense } from "react";
import Login from "./components/modules/Login";


export default function Home() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
