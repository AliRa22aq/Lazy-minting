import { Box, Button, Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const backend = () => {

    interface Job {
        userAddress: string;
        userName: string;
        voucher: {
            minPrice: number;
            name: string;
            signature: string;
        }
    }

    const [pendingJobs, setPendingJobs] = useState<Job[]>([]);

    const getPendingJobs = async () => {
        const pendingJobs = await axios.get("http://localhost:8080/getPendingJobs");
        // console.log("pendingJobs: ", Object.values(pendingJobs.data))
        setPendingJobs(Object.values(pendingJobs.data));
    }

    useEffect(() => {
        getPendingJobs()
    }, [])

    const executePendingJobs = async () => {

        const res = await axios.post("http://localhost:8080/executePendingJobs", {}) 
        console.log("res: ", res.data)
        await getPendingJobs();
        
    }


  return (
    <Box margin={10}>

            <Text fontSize="2xl" textAlign="center"> Welcome to Pending Job Section </Text>

        <Box>
            <Text fontSize="xl"> All Pending Jobs </Text>
            
            <Box>
                {
                    pendingJobs.length > 0 && pendingJobs.map((job, index) => {
                        return (
                            <Box margin={5} key={index}>
                                <Text>Name of User: {job.userName}</Text>
                                <Text>Address of User: {job.userAddress}</Text>
                            </Box>
                        )
                    })
                }

                {
                    pendingJobs.length === 0 && (
                        <Text fontSize="xl" textAlign="center" margin={20}> No Pending Job </Text>
                    )
                }

            </Box>
            
              {
                  pendingJobs.length > 0 && (
                      <Flex justifyContent="center" margin={20}>
                          <Button onClick={executePendingJobs}> Execute All Pending Jobs </Button>
                      </Flex>
                  )
              }

        </Box>

    </Box>
  )

}

export default backend