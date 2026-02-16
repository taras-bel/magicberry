"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa"
import { isConfigured } from "@/lib/config"
import { useTranslations } from "@/lib/i18n"

export default function SignInPage() {
  const t = useTranslations()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      setError(`${t('auth_pages.signin.general_error')} ${provider}`)
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(t('auth_pages.signin.error'))
      } else {
        const session = await getSession()
        if (session) {
          router.push("/dashboard")
        }
      }
    } catch (error) {
      setError(t('auth_pages.signin.general_error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="panel p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">
              {t('auth_pages.signin.title')}
            </h1>
            <p className="text-gray-600 font-normal">
              {t('auth_pages.signin.or_register').replace("или", "").replace("or", "").trim()}{" "}
              <Link href="/auth/signup" className="font-medium text-accent hover:text-accent-dark transition-colors">
                {t('auth_pages.signup.signin').toLowerCase() === "войти" ? "зарегистрируйтесь" : "register"}
              </Link>
            </p>
          </div>

          {/* Social Authentication Buttons */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">{t('auth_pages.signin.signin_with')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {isConfigured.googleOAuth() && (
                <button
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaGoogle className="text-red-500 mr-2 text-lg" />
                  Google
                </button>
              )}

              {isConfigured.facebookOAuth() && (
                <button
                  onClick={() => handleSocialSignIn("facebook")}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFacebook className="text-blue-600 mr-2 text-lg" />
                  Facebook
                </button>
              )}

              {isConfigured.githubOAuth() && (
                <button
                  onClick={() => handleSocialSignIn("github")}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaGithub className="text-gray-900 mr-2 text-lg" />
                  GitHub
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">{t('auth_pages.signin.or_password')}</span>
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth_pages.signin.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-all"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  {t('auth_pages.signin.password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-xl surface-glass border border-[var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--secondary-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 focus:border-[color:var(--accent)] transition-all"
                  placeholder={t('auth_pages.signin.password_ph')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-[rgba(214,48,49,0.08)] border border-[rgba(214,48,49,0.20)] p-4">
                <div className="text-sm text-[color:var(--accent)] font-medium">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('auth_pages.signin.loading') : t('auth_pages.signin.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
