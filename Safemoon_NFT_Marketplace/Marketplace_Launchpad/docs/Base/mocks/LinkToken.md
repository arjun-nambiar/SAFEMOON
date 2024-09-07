# LinkToken









## Methods

### allowance

```solidity
function allowance(address _owner, address _spender) external view returns (uint256 remaining)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _owner | address | undefined |
| _spender | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| remaining | uint256 | undefined |

### approve

```solidity
function approve(address _spender, uint256 _value) external nonpayable returns (bool)
```



*Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _spender | address | The address which will spend the funds. |
| _value | uint256 | The amount of tokens to be spent. |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### balanceOf

```solidity
function balanceOf(address _owner) external view returns (uint256 balance)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _owner | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| balance | uint256 | undefined |

### decimals

```solidity
function decimals() external view returns (uint8)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint8 | undefined |

### decreaseApproval

```solidity
function decreaseApproval(address _spender, uint256 _subtractedValue) external nonpayable returns (bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _spender | address | undefined |
| _subtractedValue | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

### increaseApproval

```solidity
function increaseApproval(address _spender, uint256 _addedValue) external nonpayable returns (bool success)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _spender | address | undefined |
| _addedValue | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

### name

```solidity
function name() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### symbol

```solidity
function symbol() external view returns (string)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | string | undefined |

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### transfer

```solidity
function transfer(address _to, uint256 _value) external nonpayable returns (bool success)
```



*transfer token to a specified address.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _to | address | The address to transfer to. |
| _value | uint256 | The amount to be transferred. |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

### transferAndCall

```solidity
function transferAndCall(address _to, uint256 _value, bytes _data) external nonpayable returns (bool success)
```



*transfer token to a specified address with additional data if the recipient is a contract.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _to | address | The address to transfer to. |
| _value | uint256 | The amount to be transferred. |
| _data | bytes | The extra data to be passed to the receiving contract. |

#### Returns

| Name | Type | Description |
|---|---|---|
| success | bool | undefined |

### transferFrom

```solidity
function transferFrom(address _from, address _to, uint256 _value) external nonpayable returns (bool)
```



*Transfer tokens from one address to another*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _from | address | address The address which you want to send tokens from |
| _to | address | address The address which you want to transfer to |
| _value | uint256 | uint256 the amount of tokens to be transferred |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |



## Events

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner `indexed` | address | undefined |
| spender `indexed` | address | undefined |
| value  | uint256 | undefined |

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



