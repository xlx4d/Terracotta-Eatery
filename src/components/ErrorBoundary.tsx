import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error bound by Terracotta ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-natural-cream flex items-center justify-center p-6 selection:bg-natural-sage-bg selection:text-natural-sage-text">
          <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl shadow-xl p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-stone-950">
                Something went wrong
              </h1>
              <p className="text-sm text-stone-500 leading-relaxed">
                We encountered an unexpected error while preparing your experience. The kitchen has been notified.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-50 rounded-lg text-left border border-stone-100 max-h-32 overflow-auto">
                <p className="font-mono text-xs text-stone-500 break-all whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </button>
              
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 px-4 py-2.5 border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Go to Home</span>
              </button>
            </div>
            
            <p className="font-mono text-[10px] text-stone-400 uppercase tracking-widest pt-2">
              Terracotta Eatery • Plattekloof
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
