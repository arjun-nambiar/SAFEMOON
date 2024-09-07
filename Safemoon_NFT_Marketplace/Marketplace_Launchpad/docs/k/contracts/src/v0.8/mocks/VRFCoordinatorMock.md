# VRFCoordinatorMock









## Methods

### LINK

```solidity
function LINK() external view returns (contract LinkTokenInterface)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract LinkTokenInterface | undefined |

### callBackWithRandomness

```solidity
function callBackWithRandomness(bytes32 requestId, uint256 randomness, address consumerContract) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| requestId | bytes32 | undefined |
| randomness | uint256 | undefined |
| consumerContract | address | undefined |

### onTokenTransfer

```solidity
function onTokenTransfer(address sender, uint256 fee, bytes _data) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender | address | undefined |
| fee | uint256 | undefined |
| _data | bytes | undefined |



## Events

### RandomnessRequest

```solidity
event RandomnessRequest(address indexed sender, bytes32 indexed keyHash, uint256 indexed seed)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| sender `indexed` | address | undefined |
| keyHash `indexed` | bytes32 | undefined |
| seed `indexed` | uint256 | undefined |



