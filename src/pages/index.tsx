import {
  Box, Heading, HStack, Input, VStack
} from '@chakra-ui/react'
import * as d3 from 'd3'

const regions = ['NA', 'EUW', 'EUN', 'KR', 'BR', 'JP', 'RU', 'OCE', 'TR', 'LAN', 'LAS', 'PH', 'SG', 'TH', 'TW', 'VN']
const top_3 = ['1', '2', '3']

export default function Home() {
  return (
    <VStack minHeight="60vh" justify="center" spacing="8">
      <Heading>
        <h1 className="text-6xl font-bold">LeagueScope</h1>
      </Heading>
      <Box border="2px" borderColor="black" borderRadius="xl" p="2" w="600px" mb="4">
        <Input placeholder="Search Player Database" variant="unstyled" />
      </Box>
      <HStack spacing="4" mt="6">
        {regions.map((region) => (
          <button key={region} className="w-10 h-9 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 focus:outline-none mx-1 text-sm">{region}</button>
        ))}
      </HStack>
      <HStack spacing="4" mt="4">
        {top_3.map((top) => (
          <button key={top} className="w-48 h-48 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"></button>
        ))}
      </HStack>
    </VStack>
  )
}
