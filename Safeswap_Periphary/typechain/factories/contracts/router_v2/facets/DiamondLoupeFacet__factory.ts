/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  DiamondLoupeFacet,
  DiamondLoupeFacetInterface,
} from "../../../../contracts/router_v2/facets/DiamondLoupeFacet";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_functionSelector",
        type: "bytes4",
      },
    ],
    name: "facetAddress",
    outputs: [
      {
        internalType: "address",
        name: "facetAddress_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facetAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "facetAddresses_",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_facet",
        type: "address",
      },
    ],
    name: "facetFunctionSelectors",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "_facetFunctionSelectors",
        type: "bytes4[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "facets",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address",
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]",
          },
        ],
        internalType: "struct IDiamondLoupe.Facet[]",
        name: "facets_",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610a25806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806301ffc9a71461005c57806352ef6b2c146100845780637a0ed62714610099578063adfca15e146100ae578063cdffacc6146100ce575b600080fd5b61006f61006a3660046107f4565b6100f9565b60405190151581526020015b60405180910390f35b61008c61012a565b60405161007b9190610825565b6100a16102aa565b60405161007b91906108b7565b6100c16100bc366004610934565b610674565b60405161007b919061095d565b6100e16100dc3660046107f4565b61079b565b6040516001600160a01b03909116815260200161007b565b6000806101046107d0565b6001600160e01b0319909316600090815260029093016020525050604090205460ff1690565b606060006101366107d0565b6001810154909150806001600160401b0381111561015657610156610970565b60405190808252806020026020018201604052801561017f578160200160208202803683370190505b5092506000805b828110156102a05760008460010182815481106101a5576101a5610986565b6000918252602080832060088304015460079092166004026101000a90910460e01b6001600160e01b0319811683529087905260408220549092506001600160a01b031690805b858110156102425788818151811061020657610206610986565b60200260200101516001600160a01b0316836001600160a01b031614156102305760019150610242565b8061023a816109b2565b9150506101ec565b508015610252575061028e915050565b8188868151811061026557610265610986565b6001600160a01b039092166020928302919091019091015284610287816109b2565b9550505050505b80610298816109b2565b915050610186565b5080845250505090565b606060006102b66107d0565b6001810154909150806001600160401b038111156102d6576102d6610970565b60405190808252806020026020018201604052801561031c57816020015b6040805180820190915260008152606060208201528152602001906001900390816102f45790505b5092506000816001600160401b0381111561033957610339610970565b604051908082528060200260200182016040528015610362578160200160208202803683370190505b5090506000805b8381101561060157600085600101828154811061038857610388610986565b6000918252602080832060088304015460079092166004026101000a90910460e01b6001600160e01b0319811683529088905260408220549092506001600160a01b031690805b858110156104c657826001600160a01b03168a82815181106103f3576103f3610986565b6020026020010151600001516001600160a01b031614156104b457838a828151811061042157610421610986565b60200260200101516020015188838151811061043f5761043f610986565b602002602001015161ffff168151811061045b5761045b610986565b60200260200101906001600160e01b03191690816001600160e01b0319168152505086818151811061048f5761048f610986565b6020026020010180518091906104a4906109cd565b61ffff16905250600191506104c6565b806104be816109b2565b9150506103cf565b5080156104d657506105ef915050565b818986815181106104e9576104e9610986565b60209081029190910101516001600160a01b039091169052866001600160401b0381111561051957610519610970565b604051908082528060200260200182016040528015610542578160200160208202803683370190505b5089868151811061055557610555610986565b6020026020010151602001819052508289868151811061057757610577610986565b60200260200101516020015160008151811061059557610595610986565b60200260200101906001600160e01b03191690816001600160e01b0319168152505060018686815181106105cb576105cb610986565b61ffff90921660209283029190910190910152846105e8816109b2565b9550505050505b806105f9816109b2565b915050610369565b5060005b8181101561066957600083828151811061062157610621610986565b602002602001015161ffff169050600087838151811061064357610643610986565b602002602001015160200151905081815250508080610661906109b2565b915050610605565b508085525050505090565b606060006106806107d0565b60018101549091506000816001600160401b038111156106a2576106a2610970565b6040519080825280602002602001820160405280156106cb578160200160208202803683370190505b50935060005b828110156107905760008460010182815481106106f0576106f0610986565b6000918252602080832060088304015460079092166004026101000a90910460e01b6001600160e01b031981168352908790526040909120549091506001600160a01b0390811690881681141561077b578187858151811061075457610754610986565b6001600160e01b03199092166020928302919091019091015283610777816109b2565b9450505b50508080610788906109b2565b9150506106d1565b508352509092915050565b6000806107a66107d0565b6001600160e01b03199093166000908152602093909352505060409020546001600160a01b031690565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c90565b60006020828403121561080657600080fd5b81356001600160e01b03198116811461081e57600080fd5b9392505050565b6020808252825182820181905260009190848201906040850190845b818110156108665783516001600160a01b031683529284019291840191600101610841565b50909695505050505050565b600081518084526020808501945080840160005b838110156108ac5781516001600160e01b03191687529582019590820190600101610886565b509495945050505050565b60006020808301818452808551808352604092508286019150828160051b87010184880160005b8381101561092657888303603f19018552815180516001600160a01b0316845287015187840187905261091387850182610872565b95880195935050908601906001016108de565b509098975050505050505050565b60006020828403121561094657600080fd5b81356001600160a01b038116811461081e57600080fd5b60208152600061081e6020830184610872565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006000198214156109c6576109c661099c565b5060010190565b600061ffff808316818114156109e5576109e561099c565b600101939250505056fea26469706673582212205acf78fe0dafc1c7c6e3ba8394e4ed2d5f226c645684881196fb9cd7a7a2acc264736f6c634300080b0033";

type DiamondLoupeFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DiamondLoupeFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DiamondLoupeFacet__factory extends ContractFactory {
  constructor(...args: DiamondLoupeFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DiamondLoupeFacet> {
    return super.deploy(overrides || {}) as Promise<DiamondLoupeFacet>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DiamondLoupeFacet {
    return super.attach(address) as DiamondLoupeFacet;
  }
  override connect(signer: Signer): DiamondLoupeFacet__factory {
    return super.connect(signer) as DiamondLoupeFacet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DiamondLoupeFacetInterface {
    return new utils.Interface(_abi) as DiamondLoupeFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DiamondLoupeFacet {
    return new Contract(address, _abi, signerOrProvider) as DiamondLoupeFacet;
  }
}
