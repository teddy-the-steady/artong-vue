// INFO] These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = 'ArtongNFT-Voucher'
const SIGNING_DOMAIN_VERSION = '1'

class LazyMinter {
  constructor({ contract, signer }) {
    this.contract = contract
    this.signer = signer
  }

  async createVoucher(creator, uri, minPrice = 0) {
    const voucher = { creator, uri, minPrice }
    const domain = await this._signingDomain()
    const types = {
      NFTVoucher: [
        {name: 'creator', type: 'address'},
        {name: 'minPrice', type: 'uint256'},
        {name: 'uri', type: 'string'},
      ]
    }
    const signature = await this.signer._signTypedData(domain, types, voucher)
    return {
      ...voucher,
      signature,
    }
  }

  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    const signerNetwork = await this.signer.provider.getNetwork()
    const chainId = signerNetwork.chainId
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    }
    return this._domain
  }
}

module.exports = {
  LazyMinter
}