import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function League() {
  const router = useRouter()
  const { league } = router.query
  const [teamNames, setTeamNames] = useState<string[]>([])

  useEffect(() => {
    const fetchLeagueData = async () => {
      const response = await fetch('/Data/2023_match_data.json')
      const data = await response.json()
      const teamData = data.filter((item: any) => item.position === 'team' && item.league === league )
      const teamNames: string[] = Array.from(new Set(teamData.map((item: any) => item.teamname)))
      setTeamNames(teamNames)
    }
    fetchLeagueData()
  }, [league])

  if (!league) {
    return <>Loading...</>
  }

  return (
    <>
      <h1>{league}</h1>
      <div>
        {teamNames.map((teamName: string) => (
          <button key={teamName}>{teamName}</button>
        ))}
      </div>
    </>
  )
}
