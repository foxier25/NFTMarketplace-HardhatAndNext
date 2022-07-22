import { ethers } from 'ethers'
import type { NextPage } from 'next'
import  Image from 'next/image'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { getNFTBySeller, IItem, MarketContext } from '../context'
import { shortenAddress } from '../utils'
import loaderSVG from '../assets/rings.svg';

const Dashboard:NextPage = () => {
  const {signer, web3Provider, getNFTItemsBySeller, NFTItems, soldNFTItems, isLoading } = useContext(MarketContext);
  const [balance, setBalance] = useState<string>('0');
  const [nftItems, setNFTItems] = useState<IItem[] | null>(null);
  const [showNFT, setShowNFT] = useState(true);
  const [soldNftItems, setSoldNFTItems] = useState<IItem[] | null>(null);
  
  useEffect(() =>{
   (async () => {
      const bal = await web3Provider?.getBalance(signer!); 
      if(bal)
        setBalance(parseFloat(ethers.utils.formatEther(bal)).toFixed(2))
   })()
  },[balance]);

  useEffect(()=> {
   getNFTs(); 
  },[]);
  
  const getNFTs = () => {
    getNFTItemsBySeller();
    setNFTItems(NFTItems);
    setSoldNFTItems(soldNFTItems);
  }

  const myNFT = () => {
     if(!nftItems){
       getNFTs();       
     } else {
        setShowNFT(true);
     }
  }

  const NFTSold = () => {
    if(!nftItems){
      getNFTs();       
    } else {
      setShowNFT(false);

    }
  }

  const Loader = () => (    
    <div className='w-[200px] h-[200px]'>
      <Image
       unoptimized
       src={loaderSVG}
       alt="Loading..."
       layout='responsive'
       width={300}
       height={300}
      />
   </div>); 

  const NFTS = () => (
     showNFT ? (
       <div>
        <h4>My NFT's</h4>
        {JSON.stringify(nftItems,null,2)}
       </div>
       ) : 
      (
        <div>
          <h4>Sold NFT's</h4>
         {JSON.stringify(soldNFTItems,null,2)}
        </div>)
      )
  
  return(
    <div className='bg-gradient py-5'>
      <Head>
        <title>Create NFt</title>
        <meta name="description" content="NFT Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className='text-white grid grid-cols-[30%_70%] w-[80vw] items-center justify-center my-0 mx-auto'>
        <div className='flex flex-col items-center justify-evenly text-xl'>
          <h3 className='py-2'>Address: {shortenAddress(signer!)}</h3>
          <h3 className='py-2'>Balance: {balance} eth</h3>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className='py-4'>
            <h2 className='text-3xl text-pink-600 text-center py-3'>NFT's</h2>  
            <hr className='bg-pink-400' />
          </div>
          <div className='flex items-center justify-center'>
           <button className='mr-2 p-1 w-[120px] border-2 border-blue-600 rounded-3xl hover:bg-gradient-to-r from-[#1199fa] to-[#11D2FA]' onClick={myNFT}>My NFT</button>
           <button className='ml-2 p-1 w-[120px] border-2 border-blue-600 rounded-3xl hover:bg-gradient-to-r from-[#1199fa] to-[#11D2FA]' onClick={NFTSold}>Sold</button> 
          </div>
        </div>
      </section>
      <div className='text-white flex items-center justify-center py-5'>
      { isLoading ? <Loader />  :  <NFTS />    }
      </div>
    </div>
  )
}

export default Dashboard;