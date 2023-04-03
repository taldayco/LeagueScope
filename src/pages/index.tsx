import {
  Box, Heading, HStack, Input, VStack
} from '@chakra-ui/react'
import * as d3 from 'd3'
import { useEffect, useState } from 'react'

interface CurrentVideogame {
  id: number;
  name: string;
  slug: string;
}

interface Player {
  age: number | null;
  birthday: string | null;
  first_name: string;
  id: number;
  image_url: string | null;
  last_name: string;
  modified_at: string;
  name: string;
  nationality: string;
  role: string;
  slug: string;
}

interface Team {
  acronym: string;
  current_videogame: CurrentVideogame;
  id: number;
  image_url: string;
  location: string;
  modified_at: string;
  name: string;
  players: Player[];
  slug: string;
}

const regions = ['NA', 'EUW', 'EUN', 'KR', 'BR', 'JP', 'RU', 'OCE', 'TR', 'LAN', 'LAS', 'PH', 'SG', 'TH', 'TW', 'VN', 'CN', 'OT']
const top_3 = ['1', '2', '3']

interface CountryToRegion {
  [key: string]: string;
}

const countryToRegion: CountryToRegion = {
  'PT': 'EUW',
  'PL': 'EUN',
  'GR': 'EUW',
  'US': 'NA',
  'CN': 'CN',
  'SE': 'EUN',
  'ES': 'EUW',
  'MY': 'SG',
  'BE': 'EUW',
  'JP': 'JP',
  'TN': 'EUN',
  'SA': 'EUW',
  'BG': 'EUW',
  'BA': 'EUN',
  'SI': 'EUW',
  'AR': 'LAS',
  'CA': 'NA',
  'TW': 'TW',
  'DO': 'LAN',
  'AU': 'OCE',
  'KR': 'KR',
  'MX': 'LAN',
  'TH': 'TH',
  'TR': 'TR',
  'FR': 'EUW',
  '': 'OT',
}

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0])
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    fetch('/Teams/List_lol_teams.json')
      .then(response => response.json())
      .then((data: Team[]) => {
        console.log('data:', data)
        const filteredTeams = data.filter((team) => {
          const location = team.location
          const region = countryToRegion[location]
          if (!region) {
            console.log(`Team ${team.name} (${location}) is not included in the filtered teams`)
          }
          return region === selectedRegion
        })
        setTeams(filteredTeams)
      })
      .catch(error => console.error(error))
  }, [selectedRegion])

  return (
    <VStack minHeight="80vh" justify="center" spacing="8">
      <Heading className="text-6xl font-bold">
        LeagueScope
      </Heading>
      <Box border="2px" borderColor="black" borderRadius="xl" p="2" w="600px" mb="4">
        <Input placeholder="Search Team or Player Database" variant="unstyled" />
      </Box>
      <HStack spacing="4" mt="6">
        {regions.map((region) => (
          <button
            key={region}
            className={`w-10 h-9 font-medium rounded-md text-sm ${
              selectedRegion === region
                ? 'bg-gray-400 text-gray-800 focus:outline-none'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none'}`}
            onClick={() => setSelectedRegion(region)}
          >
            {region}
          </button>
        ))}
      </HStack>
      <HStack spacing="4" mt="4">
        {top_3.map((top) => (
          <button key={top} className="w-48 h-48 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"></button>
        ))}
      </HStack>
      <Box w="600px" mt="6">
        <button className="w-full h-10 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none">
          Explore Team List
        </button>
      </Box>
      {/* <Box w="600px" mt="6">
        {teams.length > 0
          ? <ul>
            {teams.map((team) => (
              <li key={team.id}>{team.acronym}</li>
            ))}
          </ul>
          : <p>No teams found in selected region</p>
        }
      </Box> */}
    </VStack>
  )
}
