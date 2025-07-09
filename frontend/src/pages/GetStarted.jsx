import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const GetStarted = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/getUser');
        if (response.status === 200) {
          navigate("/dashboard", { replace: true });
        }
      } catch {
        // User is not authenticated, stay on this page
      }
    };

    checkAuth();
  }, [navigate]);
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Take Control of Your Finances
            </h1>
            <p className="text-xl text-base-content/80 mb-8 max-w-2xl mx-auto">
              Track your income and expenses effortlessly. Get insights into
              your spending habits and make informed financial decisions with
              our intuitive expense tracker.
            </p>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="card-title text-lg">Track Expenses</h3>
                  <p className="text-base-content/70">
                    Monitor your daily expenses and categorize them for better
                    understanding
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h3 className="card-title text-lg">Manage Income</h3>
                  <p className="text-base-content/70">
                    Record your income sources and track your earning patterns
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-info"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="card-title text-lg">Visual Reports</h3>
                  <p className="text-base-content/70">
                    Get detailed insights with charts and reports about your
                    finances
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-base-content/60">
              <p className="text-sm">
                No credit card required • Free forever • Secure & Private
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose Our Expense Tracker?
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Simple, secure, and powerful tools to help you achieve your
              financial goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-base-content/70">
                Your data is encrypted and protected
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Fast</h3>
              <p className="text-sm text-base-content/70">
                Quick and responsive interface
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-info"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-base-content/70">
                Intuitive design for everyone
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-warning"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Smart Insights</h3>
              <p className="text-sm text-base-content/70">
                AI-powered financial insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
