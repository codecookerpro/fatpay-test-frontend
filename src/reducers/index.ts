import { createSlice } from '@reduxjs/toolkit'

const mainSlice = createSlice({
	name: 'main',
	initialState: {
		tokenBalance: "0",		
		userAddress: null,
    totalClaimed: "0",
    claimableAmount: "",
    ethBalance: "0",
    operationFee: "0",
    rewardFee: "0",
    premiumRewardFee: "0",
    liquidityFee: "0",
    connected: false,
    approved: false
	},
	reducers: {
		setTokenBalance: (state: any, action: any) => {
			state.tokenBalance = action.payload;
		},
		setTotalClaimed: (state: any, action: any) => {
			state.totalClaimed = action.payload;
		},
		setUserAddress: (state: any, action: any) => {
			state.userAddress = action.payload;
		},
    setClaimableAmount: (state: any, action: any) => {
      state.claimableAmount = action.payload;
    },
    setEthBalance: (state: any, action: any ) => {
      state.ethBalance = action.payload;
    },
    setOperationFee: (state: any, action: any) => {
      state.operationFee = action.payload;
    },
    setRewardFee: (state: any, action: any) => {
      state.rewardFee = action.payload;
    },
    setPremiumRewardFee: (state: any, action: any) => {
      state.premiumRewardFee = action.payload;
    },
    setLiquidityFee: (state: any, action: any) => {
      state.liquidityFee = action.payload;
    },
    setConnected: (state: any, action: any) => {
      state.connected = action.payload;
    },
    setApproved: (state: any, action: any) => {
      state.approved = action.payload;
    },
	}
})

export const { 
	setTokenBalance,
	setTotalClaimed,
	setUserAddress,
  setClaimableAmount,
  setEthBalance,
  setOperationFee,
  setRewardFee,
  setPremiumRewardFee,
  setLiquidityFee,
  setConnected,
  setApproved
} = mainSlice.actions

export default mainSlice.reducer