import {
  Text,
  VStack,
  HStack,
  Image,
  Box,
  SimpleGrid,
  Center,
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import RewardPill from './RewardPill'

export default function MyNfts({ url, handleClick, isLocked }) {
  return (
    <Center>
      <HStack className={styles.mynfts} onClick={() => handleClick(url)}>
        <VStack gap={3} opacity={isLocked ? 0.55 : 1}>
          <Image
            borderRadius="full"
            boxSize="200px"
            src={url ? url : '/coin.svg'}
            alt="Dan Abramov"
          />
        </VStack>
      </HStack>
    </Center>
  )
}
