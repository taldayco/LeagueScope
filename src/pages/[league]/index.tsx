import { useRouter } from 'next/router'

export default function League() {
  const router = useRouter()
  const { league } = router.query

  if (!league) {
    return <>Loading...</>
  }

  return (
    <>
      {league}
    </>
  )
}
