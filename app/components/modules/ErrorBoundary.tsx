'use client';

import { Component, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback />;
    }

    return this.props.children;
  }
}

function ErrorFallback() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };
  

  useEffect(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          오류가 발생했습니다
        </h2>
        <p className="text-gray-600 mb-6">
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
