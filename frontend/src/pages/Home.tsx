import { TrendingUp, BarChart3, LineChart, PieChart, Shield, Zap, Bell, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform rotate-12">
                <TrendingUp className="w-6 h-6 text-white transform -rotate-12" />
              </div>
              <span className="text-2xl font-bold text-slate-800">Stock Master</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Pricing</a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">About</a>
              {user ? (
                <button
                  onClick={signOut}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <a
                  href="/login"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                >
                  Get Started
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Master the Market with{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Real-Time Insights
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Track stocks, analyze trends, and make informed investment decisions with our powerful analytics platform.
              </p>
              <div className="flex gap-4">
                <a
                  href="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105"
                >
                  Start Free Trial
                </a>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                    <div>
                      <p className="text-slate-400 text-sm">Portfolio Value</p>
                      <p className="text-2xl font-bold text-white">$124,567</p>
                    </div>
                    <div className="text-emerald-400 text-xl font-bold">+12.5%</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-slate-400 text-sm mb-1">AAPL</p>
                      <p className="text-white font-semibold">$182.52</p>
                      <p className="text-green-400 text-sm">+2.3%</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-slate-400 text-sm mb-1">GOOGL</p>
                      <p className="text-white font-semibold">$139.70</p>
                      <p className="text-green-400 text-sm">+1.8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600">Everything you need to succeed in the market</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <LineChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Data</h3>
              <p className="text-slate-600">Live market data and price updates across all major exchanges</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced Analytics</h3>
              <p className="text-slate-600">Deep insights with technical indicators and chart patterns</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Portfolio Tracking</h3>
              <p className="text-slate-600">Monitor your investments and track performance over time</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Alerts</h3>
              <p className="text-slate-600">Get notified of price changes and market opportunities</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Private</h3>
              <p className="text-slate-600">Bank-level security to protect your data and investments</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600">Optimized performance for seamless trading experience</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Global Markets</h3>
              <p className="text-slate-600">Access stocks from exchanges around the world</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Growth Insights</h3>
              <p className="text-slate-600">AI-powered predictions and market trend analysis</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-emerald-50 mb-8">
            Join thousands of successful investors already using Stock Master
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-105"
          >
            Start Your Free Trial
          </a>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform rotate-12">
                <TrendingUp className="w-6 h-6 text-white transform -rotate-12" />
              </div>
              <span className="text-xl font-bold text-white">Stock Master</span>
            </div>
            <p>© 2025 Stock Master. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
