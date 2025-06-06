const { sumTokens2, getResources } = require('../helper/chain/aptos')

const CONFIG = {
  ethereum: [
    '0x7712c34205737192402172409a8f7ccef8aa2aec',           // BUIDL
    '0x6a9DA2D710BB9B700acde7Cb81F10F1fF8C89041'            // BUIDL-I
  ],
  polygon: ['0x2893ef551b6dd69f661ac00f11d93e5dc5dc0e99'],  // BUIDL
  avax: ['0x53fc82f14f009009b440a706e31c9021e1196a2f'],     // BUIDL
  optimism: ['0xa1cdab15bba75a80df4089cafba013e376957cf5'], // BUIDL
  arbitrum: ['0xa6525ae43edcd03dc08e775774dcabd3bb925872'], // BUIDL
}

const tvl = async (api) => {
  const tokens = CONFIG[api.chain]
  const supplies = await api.multiCall({ calls: tokens, abi: 'erc20:totalSupply' })
  api.add(tokens, supplies)
}

Object.keys(CONFIG).forEach((chain) => {
  module.exports[chain] = { tvl }
})

module.exports.aptos = {
  tvl: async (api) => {
    const res = await getResources('0x50038be55be5b964cfa32cf128b5cf05f123959f286b4cc02b86cafd48945f89', api.chain)
    const supply = res.find(i => i.type === '0x4de5876d8a8e2be7af6af9f3ca94d9e4fafb24b5f4a5848078d8eb08f08e808a::ds_token::TokenData').data.total_issued
    api.add('ethereum:0x7712c34205737192402172409a8f7ccef8aa2aec', supply, { skipChain: true }) 
  }
}