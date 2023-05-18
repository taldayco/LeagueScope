import {
  Button, Grid, GridItem, Heading,
  HStack, Image, Skeleton, VStack
} from '@chakra-ui/react'
import * as d3 from 'd3'
import { useRouter } from 'next/router'
import {
  useEffect, useMemo, useRef, useState
} from 'react'

export default function League() {
  const router = useRouter()
  const { league } = router.query
  const [teamNames, setTeamNames] = useState<string[]>([])
  const [leagueImageURL, setLeagueImageURL] = useState<string>('')
  const [selectedButton, setSelectedButton] = useState<string>('')
  const svgRef = useRef<SVGSVGElement>(null)
  const [teamData, setTeamData] = useState<any[]>([])

  const handleButtonClick = (teamName: string) => {
    setSelectedButton(teamName)
  }

  useEffect(() => {
    const fetchDataPoints = async () => {
      const response = await fetch(`/Data/Team_Data.json`)
      const data = await response.json()
      const teamData = data.reduce((acc: any[], d: { date: string; totalgold: number }) => {
        const yValue = +d.totalgold
        if (!isNaN(yValue)) {
          acc.push({
            x: new Date(d.date).getFullYear(),
            y: yValue,
          })
        }
        return acc
      }, [])
      setTeamData(teamData)
    }
    fetchDataPoints()
  }, [])

  useEffect(() => {
    if (teamData.length > 0 && svgRef.current) {
      console.log('teamData:', teamData)
      const margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50,
      }
      const w = 400 - margin.left - margin.right
      const h = 400 - margin.top - margin.bottom
      const svg = d3
        .select(svgRef.current)
        .attr('width', w + margin.left + margin.right)
        .attr('height', h + margin.top + margin.bottom)
        .style('background', '#d3d3d3')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const xExtent = d3.extent(teamData, (d) => {
        return d.x
      }) as number[]

      const yExtent = [0, d3.max(teamData, (d) => {
        return d.y
      })]

      const xScale = d3.scaleLinear().domain(xExtent).range([0, w])

      console.log(xExtent)

      const yScale = d3.scaleLinear().domain(yExtent).range([h, 0]).nice()

      svg
        .append('g')
        .attr('transform', `translate(0,${h})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
      svg.append('g').call(d3.axisLeft(yScale))

      const generateScaledLine = d3
        .line<{ x: number; y: number }>()
        .x((d) => {
          return xScale(d.x)
        })
        .y((d) => {
          return yScale(d.y)
        })
        .curve(d3.curveCardinal)

      svg
        .selectAll('.line')
        .data([teamData as { x: number; y: number }[]])
        .join('path')
        .attr('d', (d) => {
          const pathData = generateScaledLine(d)
          return pathData
        })
        .attr('fill', 'none')
        .attr('stroke', 'black')

    }
  }, [teamData])


  useEffect(() => {
    const fetchTeamNameData = async () => {
      const response = await fetch(`/Data/Team_Name_Data.json`)
      const data = await response.json()
      const teamData = data.filter(
        (item: any) => item.league === league
      )
      const teamNames: string[] = Array.from(
        new Set(teamData.map((item: any) => item.teamname))
      )
      setTeamNames(teamNames)
    }
    fetchTeamNameData()
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
    <div style={{ position: 'relative' }}>
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
              <Button
                size="sm"
                colorScheme={selectedButton === teamName ? 'blue' : 'gray'}
                onClick={() => handleButtonClick(teamName)}
              >{teamName}</Button>
            </GridItem>
          ))
        )}
      </Grid>
      <VStack style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }}>
        <svg ref={svgRef}></svg>
      </VStack>
    </div>
  )
}

