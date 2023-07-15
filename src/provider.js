// import {ethers} from 'ethers'
import { Web3Provider } from '@ethersproject/providers'

export const getLibrary = (provider) => {
  // const library = new ethers.providers.Web3Provider(provider)
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}