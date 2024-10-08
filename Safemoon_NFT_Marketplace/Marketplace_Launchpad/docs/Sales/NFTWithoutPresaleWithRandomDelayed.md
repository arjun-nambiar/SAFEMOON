# NFTWithoutPresaleWithRandomDelayed









## Methods

### __NFTWithoutPresaleWithRandomDelayed_init

```solidity
function __NFTWithoutPresaleWithRandomDelayed_init(string _name, string _symbol, string _saleType, string _baseUri, uint256 _maxSupply, string _saleId, BaseNFTWithoutPresale.publicSaleConfig _publicSaleConfig, address _signerAddress, BaseNFTWithRandom.randomConfig _randomConfig) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _name | string | undefined |
| _symbol | string | undefined |
| _saleType | string | undefined |
| _baseUri | string | undefined |
| _maxSupply | uint256 | undefined |
| _saleId | string | undefined |
| _publicSaleConfig | BaseNFTWithoutPresale.publicSaleConfig | undefined |
| _signerAddress | address | undefined |
| _randomConfig | BaseNFTWithRandom.randomConfig | undefined |

### affiliatedUserBalance

```solidity
function affiliatedUserBalance(address) external view returns (uint256)
```

Hash map to keep count of earnings of affiliated user 



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### affiliatedWei

```solidity
function affiliatedWei() external view returns (uint256)
```

total earnings of all affiliated users 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### balanceOf

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256)
```



*See {IERC1155-balanceOf}. Requirements: - `account` cannot be the zero address.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |
| id | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])
```



*See {IERC1155-balanceOfBatch}. Requirements: - `accounts` and `ids` must have the same length.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| accounts | address[] | undefined |
| ids | uint256[] | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256[] | undefined |

### baseUri

```solidity
function baseUri() external view returns (string)
```

baseUri of the metadata of collection 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### checkAffiliatedFunds

```solidity
function checkAffiliatedFunds(address[] affiliatedUser) external view
```



*This function is used to check if each affiliated user does have user balance or not   *

#### Parameters

| Name | Type | Description |
|---|---|---|
| affiliatedUser | address[] | array of affiliation user address   |

### createAirdrop

```solidity
function createAirdrop(address[] _list, uint256[2] _shares) external nonpayable
```

This function is used to create Airdrop  

*It can only be called by owner  *

#### Parameters

| Name | Type | Description |
|---|---|---|
| _list | address[] | list of addresses   |
| _shares | uint256[2] | public Sale Shares in Airdrop  |

### dropFee

```solidity
function dropFee() external view returns (uint256)
```

nftDrop fee set by the factory owner or admin




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### factory

```solidity
function factory() external view returns (address)
```

nftDrop factory address 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### fee

```solidity
function fee() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### feeReceiver

```solidity
function feeReceiver() external view returns (address)
```

address of the feeReceiver 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### feesCollected

```solidity
function feesCollected() external view returns (uint256)
```

nftDrop fee collected 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getAssetId

```solidity
function getAssetId(uint256 _tokenID) external view returns (uint256)
```

This function is used to get random asset id  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokenID | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | assetID Random assetID   |

### getLinkAddress

```solidity
function getLinkAddress() external view returns (address)
```

This function is used to get Link address  




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | address Link address   |

### getRandomNumber

```solidity
function getRandomNumber() external view returns (uint256)
```

This function is used to get random number  




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | randomNumber Random number generated by chainlink   |

### hashforPresale

```solidity
function hashforPresale(address sender, uint256 tokenQuantity) external view returns (bytes32)
```



*This function is used to generate hash message during presale buy with whitelisted address*

#### Parameters

| Name | Type | Description |
|---|---|---|
| sender | address | The address of the NFT recipient |
| tokenQuantity | uint256 | tokenQuantity |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | hash generated by the function |

### hashforPresaleAffiliated

```solidity
function hashforPresaleAffiliated(address sender, uint256 tokenQuantity, address affiliatedUser, uint256 commission) external view returns (bytes32)
```



*This function is used to generate hash message during presale buy with affiliated link*

#### Parameters

| Name | Type | Description |
|---|---|---|
| sender | address | The address of the NFT recipient |
| tokenQuantity | uint256 | tokenQuantity |
| affiliatedUser | address | The affiliated user address |
| commission | uint256 | The commission percentage that will be paid to affiliated user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | hash generated by the function |

### hashforPublicSaleAffiliated

```solidity
function hashforPublicSaleAffiliated(address sender, address affiliatedUser, uint256 commission) external view returns (bytes32)
```



*This function is used to generate hash message in case of affiliated buy of public sale *

#### Parameters

| Name | Type | Description |
|---|---|---|
| sender | address | The address of the NFT recipient |
| affiliatedUser | address | The affiliated user address |
| commission | uint256 | The commission percentage that will be paid to affiliated user |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | hash generated by the function |

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) external view returns (bool)
```



*See {IERC1155-isApprovedForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| account | address | undefined |
| operator | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isDropApproved

```solidity
function isDropApproved() external view returns (uint256)
```

a variable for tracking whether the nftDrop is approved by the admin or not 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### isPublicSaleLive

```solidity
function isPublicSaleLive() external view returns (bool)
```

This function is used to check if public sale is started  




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | bool Return true if public is started or not   |

### matchAddressSigner

```solidity
function matchAddressSigner(bytes32 hash, bytes signature) external view returns (bool)
```



*This function is used to verify the whitelisted buyer using signature  *

#### Parameters

| Name | Type | Description |
|---|---|---|
| hash | bytes32 | The hash message generated by the function hashMessage   |
| signature | bytes | The signature sent by the buyer   |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | boolean value true if the signature is verified else false   |

### maxSupply

```solidity
function maxSupply() external view returns (uint256)
```

Max supply of collection 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxTokenPerMintPublicSale

```solidity
function maxTokenPerMintPublicSale() external view returns (uint256)
```

Maximum No of token can be purchased by user in single tx in public sale  




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### maxTokenPerPersonPublicSale

```solidity
function maxTokenPerPersonPublicSale() external view returns (uint256)
```

Maximum No of token can be purchased by user in one public sale  




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### name

```solidity
function name() external view returns (string)
```

Name of the collection 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### preSaleAirdropCount

```solidity
function preSaleAirdropCount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### publicSaleAirdropCount

```solidity
function publicSaleAirdropCount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### publicSaleBuy

```solidity
function publicSaleBuy(uint256 tokenQuantity) external payable
```

This function is used to buy and mint nft in public sale  



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenQuantity | uint256 | The token quantity that buyer wants to mint   |

### publicSaleBuyAffiliated

```solidity
function publicSaleBuyAffiliated(uint256 tokenQuantity, address affiliatedUser, uint256 commission, bytes signature) external payable
```

This function is used to buy and mint nft in public sale for affiliation feature  



#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenQuantity | uint256 | The token quantity that buyer wants to mint   |
| affiliatedUser | address | The affiliated user address   |
| commission | uint256 | The commission percentage that will be paid to affiliated user   |
| signature | bytes | The signature sent by the buyer   |

### publicSaleEndTime

```solidity
function publicSaleEndTime() external view returns (uint256)
```

Time at which public sale end (i.e., publicSaleStartTime + publicSaleDuration)




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### publicSaleMintCost

```solidity
function publicSaleMintCost() external view returns (uint256)
```

Cost to mint one token in pubic sale 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### publicSaleStartTime

```solidity
function publicSaleStartTime() external view returns (uint256)
```

Time at which public sale starts,  preSaleStartTime + preSaleDuration + publicSaleBufferDuration  




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### publicsalerListPurchases

```solidity
function publicsalerListPurchases(address) external view returns (uint256)
```

Hash map to keep count of token minted by buyer in public sale 



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rawFulfillRandomness

```solidity
function rawFulfillRandomness(bytes32 requestId, uint256 randomness) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| requestId | bytes32 | undefined |
| randomness | uint256 | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### requestRandomNumber

```solidity
function requestRandomNumber() external nonpayable returns (bytes32, uint32)
```

This function is used to request random number from chainlink oracle  

*Make sure there is link token available for fees  *


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | vrfRequestId chianlink request id   |
| _1 | uint32 | lockBlock block number when the random number is generated   |

### revealTokens

```solidity
function revealTokens(string _uri) external nonpayable
```

This function is used to reveal the token can only be called by owner  

*TokensRevealed and URI event is emitted  *

#### Parameters

| Name | Type | Description |
|---|---|---|
| _uri | string | undefined |

### revealed

```solidity
function revealed() external view returns (bool)
```

Boolean to check if NFTs are revealed




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external nonpayable
```



*See {IERC1155-safeBatchTransferFrom}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| ids | uint256[] | undefined |
| amounts | uint256[] | undefined |
| data | bytes | undefined |

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external nonpayable
```



*See {IERC1155-safeTransferFrom}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined |
| to | address | undefined |
| id | uint256 | undefined |
| amount | uint256 | undefined |
| data | bytes | undefined |

### saleId

```solidity
function saleId() external view returns (string)
```

backend saleid of drop 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### saleType

```solidity
function saleType() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external nonpayable
```



*See {IERC1155-setApprovalForAll}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined |
| approved | bool | undefined |

### setDropApproval

```solidity
function setDropApproval() external nonpayable
```

This function is used to approve the nftDrop    

*can be called from factory contract*


### setDropFee

```solidity
function setDropFee(uint256 _fee, address _wallet) external nonpayable
```

This function is used to set drop fee and fee receiver wallet  

*can be called from factory contract*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _fee | uint256 | undefined |
| _wallet | address | undefined |

### setVersion

```solidity
function setVersion(uint256 _version) external nonpayable
```

This function is used to update version of contract



#### Parameters

| Name | Type | Description |
|---|---|---|
| _version | uint256 | version number |

### signerAddress

```solidity
function signerAddress() external view returns (address)
```

address of the signer 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*See {IERC165-supportsInterface}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### symbol

```solidity
function symbol() external view returns (string)
```

Symbol of the collection 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### totalMint

```solidity
function totalMint() external view returns (uint256)
```

total mint count of collection 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### totalMintReferral

```solidity
function totalMintReferral() external view returns (uint256)
```

total mint count of collection by referral 




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transferAffiliatedFunds

```solidity
function transferAffiliatedFunds(address[] affiliatedUser) external nonpayable
```

This function is used to transfer affiliated user ether from contract  



#### Parameters

| Name | Type | Description |
|---|---|---|
| affiliatedUser | address[] | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updatePublicSale

```solidity
function updatePublicSale(uint256 _publicSaleMintCost, uint256 _publicSaleStartTime, uint256 _publicSaleDuration, uint256 _maxTokenPerMintPublicSale, uint256 _maxTokenPerPersonPublicSale) external nonpayable
```

This function is used to update public sale parameters  

*It can only be called by owner  *

#### Parameters

| Name | Type | Description |
|---|---|---|
| _publicSaleMintCost | uint256 | Cost to mint one token in pubic sale   |
| _publicSaleStartTime | uint256 | Buffer time to add between presale and public sale i.e 30 + something...   |
| _publicSaleDuration | uint256 | Duration for which public sales is live   |
| _maxTokenPerMintPublicSale | uint256 | Maximum No of tokens that can be purchased by user in single tx in public sale   |
| _maxTokenPerPersonPublicSale | uint256 | Maximum No of token can be purchased by user as whole in public sale   |

### updateSignerAddress

```solidity
function updateSignerAddress(address _signerAddress) external nonpayable
```

This function is used to update signer address  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _signerAddress | address | undefined |

### updateURI

```solidity
function updateURI(string _uri) external nonpayable
```

This function is used to update uri  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _uri | string | undefined |

### uri

```solidity
function uri(uint256 _tokenId) external view returns (string)
```

This function is used to get the token id uri  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _tokenId | uint256 | The token id for which uri is required   |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | string The uri of the token   |

### version

```solidity
function version() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### withdrawAffiliatedFunds

```solidity
function withdrawAffiliatedFunds(address[] affiliatedUser) external nonpayable
```

This function is used to withdraw affiliated user ether from contract  



#### Parameters

| Name | Type | Description |
|---|---|---|
| affiliatedUser | address[] | undefined |

### withdrawLink

```solidity
function withdrawLink(uint256 _amount) external nonpayable
```

This function is used to withdraw the LINK tokens 



#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | Amount to withdraw |

### withdrawWei

```solidity
function withdrawWei(uint256 _amount) external nonpayable
```

This function is used to withdraw ether from contract  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | undefined |



## Events

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed account, address indexed operator, bool approved)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| account `indexed` | address | undefined |
| operator `indexed` | address | undefined |
| approved  | bool | undefined |

### Initialized

```solidity
event Initialized(uint8 version)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| version  | uint8 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### RandomNumberCompleted

```solidity
event RandomNumberCompleted(bytes32 indexed requestId, uint256 randomNumber)
```

Event when random number is generated  



#### Parameters

| Name | Type | Description |
|---|---|---|
| requestId `indexed` | bytes32 | undefined |
| randomNumber  | uint256 | undefined |

### RandomNumberRequested

```solidity
event RandomNumberRequested(address indexed sender, bytes32 indexed vrfRequestId)
```

Event when random number is requested  



#### Parameters

| Name | Type | Description |
|---|---|---|
| sender `indexed` | address | undefined |
| vrfRequestId `indexed` | bytes32 | undefined |

### TokensRevealed

```solidity
event TokensRevealed(uint256 time)
```

Event when token are revealed  



#### Parameters

| Name | Type | Description |
|---|---|---|
| time  | uint256 | undefined |

### TransferBatch

```solidity
event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| operator `indexed` | address | undefined |
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| ids  | uint256[] | undefined |
| values  | uint256[] | undefined |

### TransferSingle

```solidity
event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| operator `indexed` | address | undefined |
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| id  | uint256 | undefined |
| value  | uint256 | undefined |

### URI

```solidity
event URI(string value, uint256 indexed id)
```

Event for uri change  



#### Parameters

| Name | Type | Description |
|---|---|---|
| value  | string | undefined |
| id `indexed` | uint256 | undefined |



