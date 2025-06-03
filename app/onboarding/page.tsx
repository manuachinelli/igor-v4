import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
const supabase = createBrowserSupabaseClient()

useEffect(() => {
  const setUserId = async () => {
    const { data } = await supabase.auth.getUser()
    if (data?.user?.id) {
      localStorage.setItem('igor-user-id', data.user.id)
    }
  }
  setUserId()
}, [])
