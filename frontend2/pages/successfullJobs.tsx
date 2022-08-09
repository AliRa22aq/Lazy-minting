import { Box, Button, Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const backend = () => {

    interface Job {
        userAddress: string;
        userName: string;
        tx: string;
        voucher: {
            minPrice: number;
            name: string;
            signature: string;
        }
    }

    const [successfullJobs, setSuccessfull] = useState<Job[]>([]);
    const [cancelledJobs, setcancelledJobs] = useState<Job[]>([]);

    const getSuccessfullJobs = async () => {
        const successfullJobs = await axios.get("http://localhost:8080/getSuccessfull");
        setSuccessfull(Object.values(successfullJobs.data));
    }

    const getCancelledJobs = async () => {
        const cancelledJobsxxx = await axios.get("http://localhost:8080/getCancelledJobs");
        setcancelledJobs(Object.values(cancelledJobsxxx.data));
    }

    useEffect(() => {
        getSuccessfullJobs();
        getCancelledJobs();
    }, [])


    return (
        <Box margin={10}>

            <Text fontSize="2xl" textAlign="center"> Welcome to Succussfull/Cancelled Job Section </Text>

            <Box>
                <Text fontSize="xl"> All Succussfull Jobs </Text>

                <Box>
                    {
                        successfullJobs.length > 0 && successfullJobs.map((job, index) => {
                            return (
                                <Box margin={5} key={index}>
                                    <Text>Name of User: {job.userName}</Text>
                                    <Text>Address of User: {job.userAddress}</Text>
                                    <Text>Transaction hash: {job.tx}</Text>
                                </Box>
                            )
                        })
                    }

                    {
                        successfullJobs.length === 0 && (
                            <Text fontSize="xl" textAlign="center" margin={20}> No Successfull Job </Text>
                        )
                    }

                </Box>

            </Box>

            <Box marginTop={20}>
                <Text fontSize="xl"> All Cancelled Jobs </Text>

                <Box>
                    {
                        cancelledJobs.length > 0 && cancelledJobs.map((job, index) => {
                            return (
                                <Box margin={5} key={index}>
                                    <Text>Name of User: {job.userName}</Text>
                                    <Text>Address of User: {job.userAddress}</Text>
                                </Box>
                            )
                        })
                    }

                    {
                        cancelledJobs.length === 0 && (
                            <Text fontSize="xl" textAlign="center" margin={20}> No Cancelled Job </Text>
                        )
                    }

                </Box>

            </Box>


        </Box>
    )

}

export default backend