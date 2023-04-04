import {
  Box, Heading, HStack, Image,
  Input, Link,  Spacer,
  VStack
} from '@chakra-ui/react'
import * as d3 from 'd3'
import { useEffect, useState } from 'react'

const leagues = ['LCS', 'LEC', 'LCK', 'LPL', 'PCS', 'VCS', 'CBLOL', 'LJL', 'LLA']
const top_2 = ['1', '2']

export default function Home() {
  const [selectedLeague, setSelectedLeague] = useState<string>(leagues[0])
  const [leagueImages, setLeagueImages] = useState<{ [key: string]: string }>({})
  const [TeamNames, setTeamNames] = useState<{ [key: string]: { Spring: string, Summer: string } }>({})

  useEffect(() => {
    const fetchLeagueData = async () => {
      const response = await fetch('/Data/Tier_One_Leagues.json')
      const data = await response.json()
      const images = leagues.reduce((acc: { [key: string]: string }, league: string) => {
        const leagueData = data.find((d: { [key: string]: string }) => d.League === league)
        if (leagueData) {
          acc[league + '1'] = leagueData[league + '1']
          acc[league + '2'] = leagueData[league + '2']
        }
        return acc
      }, {})
      setLeagueImages(images)

      const teamNames = leagues.reduce((acc: { [key: string]: { Spring: string; Summer: string } }, league: string) => {
        const leagueData = data.find((d: { [key: string]: string }) => d.League === league)
        if (leagueData) {
          acc[league] = {
            Spring: leagueData.Spring,
            Summer: leagueData.Summer,
          }
        }
        return acc
      }, {})
      setTeamNames(teamNames)
    }
    fetchLeagueData()
  }, [])

  return (
    <VStack minHeight="80vh" justify="center" spacing="8">
      <Heading className="text-6xl font-bold" mt={20}>
        LeagueScope
      </Heading>
      <Box border="2px" borderColor="black" borderRadius="xl" p="2" w="600px" mb="4">
        <Input placeholder="Search Team or Player Database" variant="unstyled" />
      </Box>
      <HStack spacing="4" mt="6">
        {leagues.map((league) => (
          <button
            key={league}
            className={`w-16 h-10 font-medium rounded-md text-sm ${
              selectedLeague === league
                ? 'bg-gray-400 text-gray-800 focus:outline-none'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none'}`}
            onClick={() => setSelectedLeague(league)}
          >
            {league}
          </button>
        ))}
      </HStack>
      <HStack spacing="14" mt="4">
        {top_2.map((top, index) => {
          const hasFirstImage = leagueImages[selectedLeague + '1']
          const hasSecondImage = leagueImages[selectedLeague + '2']

          if (index === 1 && !(hasFirstImage && hasSecondImage)) {
            return null // skip rendering the second button
          }
          return (
            <Link
              key={top}
              href={`/${selectedLeague}/${index === 0 ? TeamNames[selectedLeague]?.Spring : TeamNames[selectedLeague]?.Summer}`}
            >
              <button
                className={`w-48 h-48 focus:outline-none ${index === 1 && !(hasFirstImage && hasSecondImage) ? 'invisible' : ''}`}
              >
                {index === 0 && hasFirstImage && <Image src={leagueImages[selectedLeague + '1']} alt={`${selectedLeague} 1`} />}
                {index === 1 && hasSecondImage && <Image src={leagueImages[selectedLeague + '2']} alt={`${selectedLeague} 2`} />}
              </button>
            </Link>
          )
        })}
      </HStack>
      <Spacer />
      <Box w="600px">
        <button className="w-full h-10 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none">
          Explore Team List
        </button>
      </Box>
    </VStack>
  )
}
