import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Ini penting agar sesi tidak ter-refresh secara random
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Cek apakah halaman yang diakses adalah halaman auth (login/signup)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
  
  // Rute yang membutuhkan login
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/chat') || request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/wishlist')

  if (!user && isProtectedRoute) {
    // Jika belum login dan mencoba masuk ke rute terproteksi, arahkan ke /login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // Jika SUDAH login tapi mencoba buka /login atau /signup, arahkan ke Home
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
