import { Suspense } from "react";
import ErrorBoundary from "../components/modules/ErrorBoundary";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <Suspense fallback={<div>로딩 중...</div>}>
                {children}
            </Suspense>
        </ErrorBoundary>
    )
}