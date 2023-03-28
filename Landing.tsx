import {
  Button,
  VStack,
  Image,
  Box,
  Text,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { handleConnect } from '@utils/web3'
import { useState, useContext, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import withTransition from './withTransition'
import ConnectWallet from './web3/ConnectWallet'
import { MyAppContext } from '../pages/_app'
import { ethers } from 'ethers'
import { ABI } from '../abis/ABI'
import { ABI_USERNFTS } from '../abis/ABI_USERNFTS'
import Web3Modal from 'web3modal'
import UAuth from '@uauth/js'
import { disconnect } from 'process'
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from '@gelatonetwork/gasless-onboarding'

const getEthereumObject = () => window.ethereum

const findAccount = async () => {}

export function Landing() {
  const [isLoading, setLoading] = useState<boolean>(false)
  const {
    account,
    setAccount,
    contract,
    setContract,
    provider,
    setProvider,
    signer,
    setSigner,
    userUD,
    setUserUD,
    setCurrentAccountUd,
    setMyGaslessWallet,
    contractUserNFTS,
    setContractUserNFTS,
  } = useContext(MyAppContext)

  async function mylogin() {
    const gaslessWalletConfig = {
      apiKey: 'l5TBOcL4Vd_Su0afu_TTfo4q2qIUDLdnzTT0jU2AqVk_',
    }
    const loginConfig = {
      domains: [window.location.origin],
      chain: {
        id: 5,
        rpcUrl:
          'https://eth-goerli.g.alchemy.com/v2/wfmZ5V7AL4unxjEHUIfgeSAlxX3Pl0fx',
      },
      openLogin: {
        redirectUrl: `http://localhost:3000/`,
      },
    }

    const gaslessOnboarding = new GaslessOnboarding(
      loginConfig,
      gaslessWalletConfig,
    )
    await gaslessOnboarding.init()
    const web3authProvider = await gaslessOnboarding.login()
    const gaslessWallet = gaslessOnboarding.getGaslessWallet()
    setMyGaslessWallet(gaslessWallet)

    const address = gaslessWallet.getAddress()
    console.log('🚀 ~ file: Landing.tsx:85 ~ mylogin ~ address:', address)
    setAccount(address)
    if (typeof window !== 'undefined') {
      localStorage.setItem('account', address)
      console.log(
        '🚀 ~ file: Landing.tsx:89 ~ mylogin ~ localStorage:',
        localStorage,
      )
    }

    const deployedAddress = '0xDe36e7cBFF6e9D1136a2b540C6741Eba79Aa30b6'
    const deployedUsersNFTsAddress =
      '0xcAB0d540A42D7D212AdE27462721Ea86E50fA2aC'

    const signer = new ethers.providers.Web3Provider(web3authProvider)

    let contract = new ethers.Contract(deployedAddress, ABI, signer)
    setContract(contract)

    let contractTempUserNFTS = new ethers.Contract(
      deployedUsersNFTsAddress,
      ABI_USERNFTS,
      signer,
    )
    setContractUserNFTS(contractTempUserNFTS)
    const receiver = '0xF5831958f93BDb8803000532E773649ACfc4AD66'
  }

  useEffect(() => {
    if (account) {
      if (typeof window !== 'undefined') {
        localStorage.getItem(account)
        setAccount(account)
      }
    }
    mylogin()
  }, [])

  
  const getContract = async (address: string, ABI: any, signer: any) => {
    let contract = new ethers.Contract(address, ABI, signer)
    return contract
  }

  const connectWallet = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setProvider(provider)
    setSigner(signer)
    setAccount(address)

    // localStorage.setItem('currentAccountLocalStorage', address)

    // '0x16d7be29ebc6db2e9c92E0Bf1dE5c1cfe6b1AD2a',
    let contract = new ethers.Contract(
      '0xDe36e7cBFF6e9D1136a2b540C6741Eba79Aa30b6',
      ABI,
      signer,
    )
    setContract(contract)
  }

  const unstoppableInstance = new UAuth({
    clientID: '80e2228d-6107-46d6-985e-44d520f38b2b',
    redirectUri: 'https://bounty-hunter2.vercel.app/',
    scope: 'openid wallet email profile:optional social:optional',
  })

  const unstoppableLogin = async () => {
    const user = await unstoppableInstance.loginWithPopup()
    if (user) {
      setUserUD(user)
      setAccount(user?.idToken?.wallet_address)
      setCurrentAccountUd(user?.idToken?.wallet_address)
    }
  }

  const userLogOut = () => {
    setUserUD('')
  }

  return (
    <div className={styles.container}>
      <main className={styles.landing}>
        <VStack gap={3} zIndex={1}>
          <VStack>
            <Box w={400}>
              <Image src="/logo2.png" alt="Learning rewards" />
            </Box>
            <Text className={styles.title}>
              Please connect your wallet to the Goerli Network to continue.
            </Text>
          </VStack>

          <ConnectWallet />

          <Button onClick={mylogin} className={styles.connectButton}>
            Connect Wallet
          </Button>

        </VStack>
        <Box className={styles.ellipseOne}></Box>
      </main>
    </div>
  )
}

export default withTransition(Landing)
