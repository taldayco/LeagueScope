import { useRouter } from 'next/router'

export default function Team() {
  const router = useRouter()
  const { league, team, player } = router.query

  if (!league || !team || !player) {
    return <>Loading...</>
  }

  return (
    <>
      {league}
      <br />
      {team}
      <br />
      {player}
    </>
  )
}
