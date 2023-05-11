import {
  Button, Grid, GridItem, Heading,
  HStack, Image, Skeleton
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export default function League() {
  const router = useRouter()
  const { league } = router.query
  const [teamNames, setTeamNames] = useState<string[]>([])
  const [leagueImageURL, setLeagueImageURL] = useState<string>('')

  useEffect(() => {
    const fetchLeagueData = async () => {
      const allData = []
      for (let year = 2014; year <= 2023; year++) {
        const response = await fetch(`/Data/${year}_match_data.json`)
        const data = await response.json()
        allData.push(...data)
      }
      const teamData = allData.filter(
        (item: any) => item.position === 'team' && item.league === league
      )
      const teamNames: string[] = Array.from(
        new Set(teamData.map((item: any) => item.teamname))
      )
      setTeamNames(teamNames)
    }
    fetchLeagueData()
  }, [league])

  const memTeamNames = useMemo(() => {
    return teamNames
  }, [teamNames])



  useEffect(() => {
    const fetchLeagueImageURL = async () => {
      const response = await fetch('/Data/Tier_One_Leagues.json')
      const data = await response.json()
      const leagueData = data.find((item: any) => item.League === league)
      if (leagueData) {
        setLeagueImageURL(leagueData[`${league}0`])
      }
    }
    fetchLeagueImageURL()
  }, [league])

  if (!league) {
    return <>Loading...</>
  }

  return (
    <Grid gap={6}>
      <GridItem>
        <HStack>
          <Image src={leagueImageURL} alt={Array.isArray(league) ? league[0] : league} boxSize="100px" />
          <Heading>{league}</Heading>
        </HStack>
      </GridItem>
      {memTeamNames.length === 0 ? (
        <GridItem>
          <Skeleton height={'600px'} width={'150px'} />
        </GridItem>
      ) : (
        memTeamNames.map((teamName: string) => (
          <GridItem key={teamName}>
            <Button size="sm">{teamName}</Button>
          </GridItem>
        ))
      )}
    </Grid>
  )
}
