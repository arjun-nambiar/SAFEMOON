/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface BuyBackBurnInterface extends utils.Interface {
  contractName: "BuyBackBurn";
  functions: {
    "buyBackAndBurn()": FunctionFragment;
    "changeRouter(address)": FunctionFragment;
    "changeSFMToken(address)": FunctionFragment;
    "changeThreshold(uint256)": FunctionFragment;
    "initialize(uint256,address,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "sfmTokenAddress()": FunctionFragment;
    "threshold()": FunctionFragment;
    "tradeRouter()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "buyBackAndBurn",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "changeRouter",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "changeSFMToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "changeThreshold",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sfmTokenAddress",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "threshold", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tradeRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "buyBackAndBurn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeSFMToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeThreshold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sfmTokenAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "threshold", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tradeRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "ChangeRouter(address)": EventFragment;
    "ChangeSFMAddress(address)": EventFragment;
    "ChangeThreshold(uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ChangeRouter"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ChangeSFMAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ChangeThreshold"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type ChangeRouterEvent = TypedEvent<[string], { router: string }>;

export type ChangeRouterEventFilter = TypedEventFilter<ChangeRouterEvent>;

export type ChangeSFMAddressEvent = TypedEvent<[string], { token: string }>;

export type ChangeSFMAddressEventFilter =
  TypedEventFilter<ChangeSFMAddressEvent>;

export type ChangeThresholdEvent = TypedEvent<
  [BigNumber],
  { amount: BigNumber }
>;

export type ChangeThresholdEventFilter = TypedEventFilter<ChangeThresholdEvent>;

export type InitializedEvent = TypedEvent<[number], { version: number }>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface BuyBackBurn extends BaseContract {
  contractName: "BuyBackBurn";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BuyBackBurnInterface;

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
    buyBackAndBurn(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    changeRouter(
      _tradeRouter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    changeSFMToken(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    changeThreshold(
      _threshold: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _threshold: BigNumberish,
      _tradeRouter: string,
      _sfmToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sfmTokenAddress(overrides?: CallOverrides): Promise<[string]>;

    threshold(overrides?: CallOverrides): Promise<[BigNumber]>;

    tradeRouter(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  buyBackAndBurn(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  changeRouter(
    _tradeRouter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  changeSFMToken(
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  changeThreshold(
    _threshold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _threshold: BigNumberish,
    _tradeRouter: string,
    _sfmToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sfmTokenAddress(overrides?: CallOverrides): Promise<string>;

  threshold(overrides?: CallOverrides): Promise<BigNumber>;

  tradeRouter(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buyBackAndBurn(overrides?: CallOverrides): Promise<void>;

    changeRouter(
      _tradeRouter: string,
      overrides?: CallOverrides
    ): Promise<void>;

    changeSFMToken(_token: string, overrides?: CallOverrides): Promise<void>;

    changeThreshold(
      _threshold: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    initialize(
      _threshold: BigNumberish,
      _tradeRouter: string,
      _sfmToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    sfmTokenAddress(overrides?: CallOverrides): Promise<string>;

    threshold(overrides?: CallOverrides): Promise<BigNumber>;

    tradeRouter(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ChangeRouter(address)"(router?: null): ChangeRouterEventFilter;
    ChangeRouter(router?: null): ChangeRouterEventFilter;

    "ChangeSFMAddress(address)"(token?: null): ChangeSFMAddressEventFilter;
    ChangeSFMAddress(token?: null): ChangeSFMAddressEventFilter;

    "ChangeThreshold(uint256)"(amount?: null): ChangeThresholdEventFilter;
    ChangeThreshold(amount?: null): ChangeThresholdEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    buyBackAndBurn(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    changeRouter(
      _tradeRouter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    changeSFMToken(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    changeThreshold(
      _threshold: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      _threshold: BigNumberish,
      _tradeRouter: string,
      _sfmToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sfmTokenAddress(overrides?: CallOverrides): Promise<BigNumber>;

    threshold(overrides?: CallOverrides): Promise<BigNumber>;

    tradeRouter(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyBackAndBurn(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    changeRouter(
      _tradeRouter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    changeSFMToken(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    changeThreshold(
      _threshold: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _threshold: BigNumberish,
      _tradeRouter: string,
      _sfmToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sfmTokenAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    threshold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tradeRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
