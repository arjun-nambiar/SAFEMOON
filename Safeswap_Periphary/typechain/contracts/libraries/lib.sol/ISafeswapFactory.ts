/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface ISafeswapFactoryInterface extends utils.Interface {
  functions: {
    "allPairs(uint256)": FunctionFragment;
    "allPairsLength()": FunctionFragment;
    "approvePartnerStatus(address)": FunctionFragment;
    "createPair(address,address,address)": FunctionFragment;
    "feeTo()": FunctionFragment;
    "feeToSetter()": FunctionFragment;
    "getPair(address,address)": FunctionFragment;
    "isBlacklistedStatus(address)": FunctionFragment;
    "isBlacklistedToken(address)": FunctionFragment;
    "router()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "allPairs"
      | "allPairsLength"
      | "approvePartnerStatus"
      | "createPair"
      | "feeTo"
      | "feeToSetter"
      | "getPair"
      | "isBlacklistedStatus"
      | "isBlacklistedToken"
      | "router"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "allPairs",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "allPairsLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "approvePartnerStatus",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "createPair",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(functionFragment: "feeTo", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "feeToSetter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPair",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isBlacklistedStatus",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isBlacklistedToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "router", values?: undefined): string;

  decodeFunctionResult(functionFragment: "allPairs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "allPairsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approvePartnerStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "feeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "feeToSetter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPair", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isBlacklistedStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isBlacklistedToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "router", data: BytesLike): Result;

  events: {
    "PairCreated(address,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PairCreated"): EventFragment;
}

export interface PairCreatedEventObject {
  token0: string;
  token1: string;
  pair: string;
  arg3: BigNumber;
}
export type PairCreatedEvent = TypedEvent<
  [string, string, string, BigNumber],
  PairCreatedEventObject
>;

export type PairCreatedEventFilter = TypedEventFilter<PairCreatedEvent>;

export interface ISafeswapFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ISafeswapFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { pair: string }>;

    allPairsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    approvePartnerStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    feeTo(overrides?: CallOverrides): Promise<[string]>;

    feeToSetter(overrides?: CallOverrides): Promise<[string]>;

    getPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string] & { pair: string }>;

    isBlacklistedStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isBlacklistedToken(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    router(overrides?: CallOverrides): Promise<[string]>;
  };

  allPairs(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

  approvePartnerStatus(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  createPair(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  feeTo(overrides?: CallOverrides): Promise<string>;

  feeToSetter(overrides?: CallOverrides): Promise<string>;

  getPair(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  isBlacklistedStatus(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isBlacklistedToken(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  router(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

    approvePartnerStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    feeTo(overrides?: CallOverrides): Promise<string>;

    feeToSetter(overrides?: CallOverrides): Promise<string>;

    getPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    isBlacklistedStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isBlacklistedToken(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    router(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "PairCreated(address,address,address,uint256)"(
      token0?: PromiseOrValue<string> | null,
      token1?: PromiseOrValue<string> | null,
      pair?: null,
      arg3?: null
    ): PairCreatedEventFilter;
    PairCreated(
      token0?: PromiseOrValue<string> | null,
      token1?: PromiseOrValue<string> | null,
      pair?: null,
      arg3?: null
    ): PairCreatedEventFilter;
  };

  estimateGas: {
    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

    approvePartnerStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    feeTo(overrides?: CallOverrides): Promise<BigNumber>;

    feeToSetter(overrides?: CallOverrides): Promise<BigNumber>;

    getPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isBlacklistedStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isBlacklistedToken(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    router(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    allPairs(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allPairsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    approvePartnerStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    feeTo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeToSetter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isBlacklistedStatus(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isBlacklistedToken(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    router(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
