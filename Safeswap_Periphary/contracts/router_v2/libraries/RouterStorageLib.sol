// SPDX-License-Identifier: MIT

// solhint-disable-next-line compiler-version
pragma solidity 0.8.11;

library RouterStorageLib {
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.router.storage");
    uint256 public constant ONE = 1e18;

    struct TokenInfo {
        bool enabled;
        bool isDeleted;
        string tokenName;
        address tokenAddress;
        address feesAddress;
        uint256 buyFeePercent;
        uint256 sellFeePercent;
    }

    struct RouterState {
        address factory;
        address WETH;
        bool killSwitch;
        address admin;
        uint256 tokensCount;
        mapping(address => bool) _lpTokenLockStatus;
        mapping(address => uint256) _locktime;
        mapping(address => TokenInfo) nameToInfo;
        mapping(uint256 => address) idToAddress;
        address routerTrade;
        mapping(address => bool) whitelistAccess;
    }

    function diamondStorage() internal pure returns (RouterState storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function setFactoryAddress(address _factory) internal {
        RouterState storage state = diamondStorage();
        state.factory = _factory;
    }
    function getFactoryAddress() internal view returns (address) {
        RouterState storage state = diamondStorage();
        return state.factory;
    }

    function setWETHAddress(address _weth) internal {
        RouterState storage state = diamondStorage();
        state.WETH = _weth;
    }
    function getWETHAddress() internal view returns (address) {
        RouterState storage state = diamondStorage();
        return state.WETH;
    }

    function setAdminAddress(address _admin) internal {
        RouterState storage state = diamondStorage();
        state.admin = _admin;
    }
    function getAdminAddress() internal view returns (address) {
        RouterState storage state = diamondStorage();
        return state.admin;
    }

    function setTokensCount(uint _tokensCount) internal {
        RouterState storage state = diamondStorage();
        state.tokensCount = _tokensCount;
    }
    function getTokensCount() internal view returns (uint) {
        RouterState storage state = diamondStorage();
        return state.tokensCount;
    }

    function setLpTokenStatus(address _lpTokenStatus, bool _status) internal {
        RouterState storage state = diamondStorage();
        state._lpTokenLockStatus[_lpTokenStatus] = _status;
    }
    function getLpTokenStatus(address _lpTokenStatus) internal view returns (bool) {
        RouterState storage state = diamondStorage();
        return state._lpTokenLockStatus[_lpTokenStatus];
    }

    function setLockTime(address _addr, uint _data) internal {
        RouterState storage state = diamondStorage();
        state._locktime[_addr] = _data;
    }
    function getLockTime(address _addr) internal view returns (uint) {
        RouterState storage state = diamondStorage();
        return state._locktime[_addr];
    }

    function getNameToTokenInfo(address _token) internal view returns (TokenInfo memory) {
        RouterState storage state = diamondStorage();
        return state.nameToInfo[_token];
    }
    function setNameToTokenInfo(address _token, TokenInfo memory _tokenInfo) internal {
        RouterState storage state = diamondStorage();
        state.nameToInfo[_token] = _tokenInfo;
    }

    function getIdToAddress(uint _id) internal view returns (address) {
        RouterState storage state = diamondStorage();
        return state.idToAddress[_id];
    }
    function setIdToAddress(uint _id, address _addr) internal {
        RouterState storage state = diamondStorage();
        state.idToAddress[_id] = _addr;
    }

    function getRouterTrade()  internal view returns (address) {
        RouterState storage state = diamondStorage();
        return state.routerTrade;
    }
    function setRouterTrade(address _addr) internal {
        RouterState storage state = diamondStorage();
        state.routerTrade = _addr;
    }

    function setWhitelistAccess(address _addr, bool _status) internal {
        RouterState storage state = diamondStorage();
        state.whitelistAccess[_addr] = _status;
    }
    function getWhitelistAccess(address _addr) internal view returns (bool) {
        RouterState storage state = diamondStorage();
        return state.whitelistAccess[_addr];
    }

    function setKillSwitch(bool _status) internal {
        RouterState storage state = diamondStorage();
        state.killSwitch = _status;
    }
    function getKillSwitch() internal view returns (bool) {
        RouterState storage state = diamondStorage();
        return state.killSwitch;
    }
}
