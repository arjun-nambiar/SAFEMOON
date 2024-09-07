/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TradeRouter, TradeRouterInterface } from "../TradeRouter";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
    ],
    name: "getSwapFees",
    outputs: [
      {
        internalType: "uint256",
        name: "_fees",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "setRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "path",
            type: "address[]",
          },
          {
            internalType: "address payable",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        internalType: "struct ITradeRouter.Trade",
        name: "trade",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_feeAmount",
        type: "uint256",
      },
    ],
    name: "swapExactETHForTokensWithFeeAmount",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapRouter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506102f5806100206000396000f3fe60806040526004361061005a5760003560e01c8063c0d7865511610043578063c0d78655146100a9578063c31c9c07146100fe578063f887ea401461013057600080fd5b806344a850ba1461005f578063a351408714610095575b600080fd5b34801561006b57600080fd5b5061008261007a366004610182565b600092915050565b6040519081526020015b60405180910390f35b6100a76100a3366004610253565b5050565b005b3480156100b557600080fd5b506100a76100c436600461029d565b600080547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0392909216919091179055565b34801561010a57600080fd5b506000546001600160a01b03165b6040516001600160a01b03909116815260200161008c565b34801561013c57600080fd5b50600054610118906001600160a01b031681565b634e487b7160e01b600052604160045260246000fd5b80356001600160a01b038116811461017d57600080fd5b919050565b6000806040838503121561019557600080fd5b8235915060208084013567ffffffffffffffff808211156101b557600080fd5b818601915086601f8301126101c957600080fd5b8135818111156101db576101db610150565b8060051b604051601f19603f8301168101818110858211171561020057610200610150565b60405291825284820192508381018501918983111561021e57600080fd5b938501935b828510156102435761023485610166565b84529385019392850192610223565b8096505050505050509250929050565b6000806040838503121561026657600080fd5b823567ffffffffffffffff81111561027d57600080fd5b830160a0818603121561028f57600080fd5b946020939093013593505050565b6000602082840312156102af57600080fd5b6102b882610166565b939250505056fea2646970667358221220d74a820ff2fc50daf8e91091b8e5ac77f2d22f2913455bccfc1710f6b7a6239564736f6c634300080d0033";

type TradeRouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TradeRouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TradeRouter__factory extends ContractFactory {
  constructor(...args: TradeRouterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "TradeRouter";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TradeRouter> {
    return super.deploy(overrides || {}) as Promise<TradeRouter>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TradeRouter {
    return super.attach(address) as TradeRouter;
  }
  connect(signer: Signer): TradeRouter__factory {
    return super.connect(signer) as TradeRouter__factory;
  }
  static readonly contractName: "TradeRouter";
  public readonly contractName: "TradeRouter";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TradeRouterInterface {
    return new utils.Interface(_abi) as TradeRouterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TradeRouter {
    return new Contract(address, _abi, signerOrProvider) as TradeRouter;
  }
}
