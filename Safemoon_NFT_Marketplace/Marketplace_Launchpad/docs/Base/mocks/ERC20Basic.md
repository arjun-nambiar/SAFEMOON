# ERC20Basic



> ERC20Basic



*Simpler version of ERC20 interfacesee https://github.com/ethereum/EIPs/issues/179*

## Methods

### balanceOf

```solidity
function balanceOf(address who) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| who | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transfer

```solidity
function transfer(address to, uint256 value) external nonpayable returns (bool)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined |
| value | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |



## Events

### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| value  | uint256 | undefined |



