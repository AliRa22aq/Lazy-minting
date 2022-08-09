import { Box, Button, Flex, Image, Input, Text } from '@chakra-ui/react'
import { ethers } from 'ethers';
import type { NextPage } from 'next'
import { useState } from 'react';
import { voucher } from '../utils/CreateVoucher';
import axios from "axios";
import abi from "../utils/abis.json";
import addresses from "../utils/contractAddresses.json";

interface User {
  address: string;
  signer: ethers.providers.JsonRpcSigner;
}

const Home: NextPage = () => {

  const [user, setUser] = useState<User>();
  const [name, setName] = useState<string>("");

  const connectWeb3 = async () => {

    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setUser({address: address, signer: signer });

    } catch (error) {
      console.log("Error connecting to metamask", error);
    }

  };

  const createVoucher = async () => { 
    if(!user || !name) return;

    const { ethereum } = window as any;
    if (!ethereum) {
      console.log("Metamask not detected");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(addresses.lazyNFT, abi, provider)
    const minter = user.signer;
    const { chainId } = await provider.getNetwork();
    const uri = "https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
    const _voucher = await voucher(contract, chainId,  minter, name, uri);
            
    const res2 = await axios.post("http://localhost:8080/handleVoucher", {
      id: user.address, 
      data: {voucher: _voucher, userAddress: user.address, userName: _voucher.name}
    });
    console.log("Res: ", res2.data)
    
    alert("Success!")

  }

  return (
    <div>
   
    <Box margin={10} >

      <Text textAlign="center"> Please fill in the minting voucher. </Text>
      
      <Box marginTop={5}>
        <Flex justifyContent="center">
          <Image src='https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi' alt="nft" width={300} />
        </Flex>
        <Text textAlign="center" margin={2}> Price: Free </Text>

        {
          user && (
            <>
            <Flex margin={2} justifyContent="center" alignItems="center" >
              <Input 
                type="text" 
                width={200} 
                textAlign="center" 
                marginLeft={2} 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                />
            </Flex>
            <Flex margin={2} justifyContent="center" alignItems="center" >
              <Button onClick={createVoucher}> Create Voucher </Button>
            </Flex>
            </>
          )
        }

        {
          !user && (
            <Flex margin={2} justifyContent="center" alignItems="center">
              <Button onClick={connectWeb3}> Connect Wallet </Button>
            </Flex>
          )
        }

      
      
      </Box>

    </Box>

    </div>
  )
}

export default Home
