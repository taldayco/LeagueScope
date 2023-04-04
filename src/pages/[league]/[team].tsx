import { useRouter } from 'next/router'

export default function Team() {
  const router = useRouter()
  const { league, team } = router.query

  if (!league || !team) {
    return <>Loading...</>
  }

  return (
    <>
      {league}
      <br />
      {team}
    </>
  )
}
