# NFTFactory









## Methods

### deployNFTWithPresaleWithRandomdelayed

```solidity
function deployNFTWithPresaleWithRandomdelayed(string _name, string _symbol, string _saleCreator, string _baseUri, uint256 _maxSupply, string _saleId, BaseNFTWithPresale.preSaleConfig _preSaleConfig, BaseNFTWithPresale.publicSaleConfig _publicSaleConfig, address _signerAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _name | string | undefined |
| _symbol | string | undefined |
| _saleCreator | string | undefined |
| _baseUri | string | undefined |
| _maxSupply | uint256 | undefined |
| _saleId | string | undefined |
| _preSaleConfig | BaseNFTWithPresale.preSaleConfig | undefined |
| _publicSaleConfig | BaseNFTWithPresale.publicSaleConfig | undefined |
| _signerAddress | address | undefined |

### deployNFTWithPresaleWithoutRandomInstant

```solidity
function deployNFTWithPresaleWithoutRandomInstant(string _name, string _symbol, string _saleCreator, string _presaleBaseUri, uint256 _maxSupply, string _saleId, BaseNFTWithPresale.preSaleConfig _preSaleConfig, BaseNFTWithPresale.publicSaleConfig _publicSaleConfig, address _signerAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _name | string | undefined |
| _symbol | string | undefined |
| _saleCreator | string | undefined |
| _presaleBaseUri | string | undefined |
| _maxSupply | uint256 | undefined |
| _saleId | string | undefined |
| _preSaleConfig | BaseNFTWithPresale.preSaleConfig | undefined |
| _publicSaleConfig | BaseNFTWithPresale.publicSaleConfig | undefined |
| _signerAddress | address | undefined |

### deployNFTWithoutPresaleWithRandomdelayed

```solidity
function deployNFTWithoutPresaleWithRandomdelayed(string _name, string _symbol, string _saleCreator, string _baseUri, uint256 _maxSupply, string _saleId, BaseNFTWithoutPresale.publicSaleConfig _publicSaleConfig, address _signerAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _name | string | undefined |
| _symbol | string | undefined |
| _saleCreator | string | undefined |
| _baseUri | string | undefined |
| _maxSupply | uint256 | undefined |
| _saleId | string | undefined |
| _publicSaleConfig | BaseNFTWithoutPresale.publicSaleConfig | undefined |
| _signerAddress | address | undefined |

### deployNFTWithoutPresaleWithoutRandomInstant

```solidity
function deployNFTWithoutPresaleWithoutRandomInstant(string _name, string _symbol, string _saleCreator, string _presaleBaseUri, uint256 _maxSupply, string _saleId, BaseNFTWithoutPresale.publicSaleConfig _publicSaleConfig, address _signerAddress) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _name | string | undefined |
| _symbol | string | undefined |
| _saleCreator | string | undefined |
| _presaleBaseUri | string | undefined |
| _maxSupply | uint256 | undefined |
| _saleId | string | undefined |
| _publicSaleConfig | BaseNFTWithoutPresale.publicSaleConfig | undefined |
| _signerAddress | address | undefined |

### isDropDeployed

```solidity
function isDropDeployed(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isDropFeeSet

```solidity
function isDropFeeSet(address) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### isSaleidExists

```solidity
function isSaleidExists(string) external view returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### setApproval

```solidity
function setApproval(address _nftDrop) external nonpayable
```

This function is used to approve deployed nftDrop



#### Parameters

| Name | Type | Description |
|---|---|---|
| _nftDrop | address | drop address   |

### setDropFee

```solidity
function setDropFee(address _nftDrop, address _feeWallet, uint256 _fee) external nonpayable
```

This function is used to set drop fees and feeReceiver wallet for nftdrop



#### Parameters

| Name | Type | Description |
|---|---|---|
| _nftDrop | address | drop address   |
| _feeWallet | address | undefined |
| _fee | uint256 | undefined |

### setFee

```solidity
function setFee(uint256 _fee) external nonpayable
```

This function is used to update fee  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _fee | uint256 | fee |

### setKeyHash

```solidity
function setKeyHash(bytes32 _keyHash) external nonpayable
```

This function is used to update key hash  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _keyHash | bytes32 | Chain Link random key hash   |

### setLinkTokenAddress

```solidity
function setLinkTokenAddress(address _link) external nonpayable
```

This function is used to update link token address  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _link | address | Chain Link link token address   |

### setVersion

```solidity
function setVersion(uint256 _version) external nonpayable
```

This function is used to update version  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _version | uint256 | version number |

### setVrfCoordinator

```solidity
function setVrfCoordinator(address _vrfCoordinator) external nonpayable
```

This function is used to update vrfCoordinator address  



#### Parameters

| Name | Type | Description |
|---|---|---|
| _vrfCoordinator | address | Chain Link vrfCoordinator address   |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### updateImplementation

```solidity
function updateImplementation(address newImpl, uint256 typeId) external nonpayable
```

sets the new implementation

*external function to update the new address of the implementation contract, only callable by owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newImpl | address | addres of the new implementation contract |
| typeId | uint256 | implementation type |

### version

```solidity
function version() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |



## Events

### Approved

```solidity
event Approved(address approver, address nftDrop)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| approver  | address | undefined |
| nftDrop  | address | undefined |

### ImplementationUpdated

```solidity
event ImplementationUpdated(address previousImpl, address newImpl, uint256 typeId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousImpl  | address | undefined |
| newImpl  | address | undefined |
| typeId  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### SaleCreated

```solidity
event SaleCreated(address clone, string saleID)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| clone  | address | undefined |
| saleID  | string | undefined |

### SetDropFee

```solidity
event SetDropFee(address indexed nftDrop, address feeWallet, uint256 fee)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| nftDrop `indexed` | address | undefined |
| feeWallet  | address | undefined |
| fee  | uint256 | undefined |



