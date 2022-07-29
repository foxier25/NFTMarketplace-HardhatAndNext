

import React, { useContext, useEffect, useState } from 'react'
import { CollectiblesMenu, NFTCardItems } from '../../components'
import { fetchMarketItems, getItems, MarketContext } from '../../context';
import { IItem } from '../../interfaces'
import { Loader } from '../common';

export const TopCollectibles = () => {
  const { signer, marketContract, nftContract, isConnected} = useContext(MarketContext);
  const [items, setItems] = useState<IItem[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
   if(!marketContract) return; 
   if(!nftContract) return; 
   (async () => {
    try {
      console.log('CONN ',isConnected)
      setIsLoading(true);
      const [nfts] = await fetchMarketItems({marketContract: marketContract, offSet: 0, limit: 6});
      const genItems = await getItems(nftContract, nfts);
      setItems(genItems);
      setIsLoading(false);  
    } catch (error) {
      setIsLoading(false);  
    }
    
   })()
  },[signer, isConnected]);

  return (
      isLoading ? (
           <Loader className='relative w-[150px] h-[150px] bg-gradient my-0 mx-auto' size={150} /> ) : (
        <div className='relative w-[75%] h-[100%] bg-gradient my-0 mx-auto'>
          <h2 className='text-white text-center text-[50px] mb-5'>Top Collectibles</h2>
          <CollectiblesMenu/>
          <NFTCardItems items={items}/>
        </div>
      )
  )
}
