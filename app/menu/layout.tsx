import { Suspense } from "react";
import ErrorBoundary from "../components/modules/ErrorBoundary";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary fallback={<div>에러가 발생했습니다. 잠시 후 다시 시도해주세요. in menu</div>}>
            <Suspense fallback={<div>로딩 중...</div>}>
                {children}
            </Suspense>
        </ErrorBoundary>
    )
}