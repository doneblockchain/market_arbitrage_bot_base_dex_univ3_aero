// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;
pragma abicoder v2;

import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";
import {TransferHelper} from '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import {IV3SwapRouter} from "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";


interface ISwapRouter02 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to
    ) external payable returns (uint256 amountOut);
}


interface IAerodromeRouter {
        struct Route {
            address from;
            address to;
            bool stable;
            address factory;
        }

        function swapExactTokensForTokens(
            uint amountIn,
            uint amountOutMin,
            Route[] calldata routes,
            address to,
            uint deadline
        ) external returns (uint[] memory amounts);
        
        function getAmountsOut(uint256 amountIn, Route[] memory routes) 
            external view returns (uint256[] memory amounts);
    }

contract Arbitrage is IFlashLoanRecipient {
    IVault private constant vault =
        IVault(0xBA12222222228d8Ba445958a75a0704d566BF2C8);

    address public owner;
    address public router = 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43;
    address public factory = 0x420DD381b31aEf6683db6B902084cB0FFECe40Da;
    address public QUOTER_ADDRESS = 0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a;

    struct Trade {
        address[] routerPath;
        address[] tokenPath;
        uint24 fee;
        uint256 token1_needed;
        bool firstUni;
    }

    constructor() {
        owner = msg.sender;
    }

    function executeTrade(
        address[] memory _routerPath,
        address[] memory _tokenPath,
        uint24 _fee,
        uint256 _token1_needed,
        uint256 _flashAmount,
        bool _firstUni
    ) external {
        bytes memory data = abi.encode(
            Trade({routerPath: _routerPath, tokenPath: _tokenPath, fee: _fee, token1_needed: _token1_needed, firstUni: _firstUni})
        );
        require(msg.sender == owner);
        
        // Token to flash loan, by default we are flash loaning 1 token.
        IERC20[] memory tokens = new IERC20[](1);
        tokens[0] = IERC20(_tokenPath[0]);

        // Flash loan amount.
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _flashAmount;

        vault.flashLoan(this, tokens, amounts, data);
    }

    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) external override {
        require(msg.sender == address(vault));

        // Decode our swap data so we can use it
        Trade memory trade = abi.decode(userData, (Trade));
        uint256 flashAmount = amounts[0];

        // Since balancer called this function, we should have funds to begin swapping...

        if(trade.firstUni == true) {
        // We perform the 1st swap.
        // We swap the flashAmount of token0 and expect to get X amount of token1
            _swapOnV3(
                trade.routerPath[0],
                trade.tokenPath[0],
                flashAmount,
                trade.tokenPath[1],
                trade.token1_needed,
                trade.fee
            );
            _swapOnAerodrome(
                trade.tokenPath[1],
                trade.tokenPath[0],
                IERC20(trade.tokenPath[1]).balanceOf(address(this)),
                flashAmount,  // from quoter off-chain
                false,         // or true if stable pool
                address(this)
            );
        }
        else {
            _swapOnAerodrome(
                trade.tokenPath[0],
                trade.tokenPath[1],
                flashAmount,
                trade.token1_needed,  // from quoter off-chain
                false,         // or true if stable pool
                address(this)
            );


        // We perform the 2nd swap.
        // We swap the contract balance of token1 and
        // expect to at least get the flashAmount of token0
            _swapOnV3(
                trade.routerPath[1],
                trade.tokenPath[1],
                IERC20(trade.tokenPath[1]).balanceOf(address(this)),
                trade.tokenPath[0],
                flashAmount,
                trade.fee
            );
        }
        // Transfer back what we flash loaned
        IERC20(trade.tokenPath[0]).transfer(address(vault), flashAmount);
        // Transfer any excess tokens [i.e. profits] to owner
        IERC20(trade.tokenPath[0]).transfer(
            owner,
            IERC20(trade.tokenPath[0]).balanceOf(address(this))
        );
    }

    // -- INTERNAL FUNCTIONS -- //

    function _swapOnAerodrome(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 amountOutMin,
    bool stable,
    address recipient
    ) internal returns (uint256[] memory amounts) {
        IERC20(tokenIn).approve(router, amountIn);
        // 1. Create a memory array of 1 Route
        IAerodromeRouter.Route[] memory routes = new IAerodromeRouter.Route[](1); 
        routes[0] = IAerodromeRouter.Route(
            tokenIn,
            tokenOut,
            stable,
            factory
        );
        uint256[] memory returnAmounts = IAerodromeRouter(router).getAmountsOut(amountIn,routes);

        // Perform swap
        amounts = IAerodromeRouter(router).swapExactTokensForTokens(
            amountIn,
            returnAmounts[1],
            routes,
            recipient,
            block.timestamp
        );

    }

    function _swapOnV3(
        address _router,
        address _tokenIn,
        uint256 _amountIn,
        address _tokenOut,
        uint256 _amountOut,
        uint24 _fee
    ) internal {
        // Approve token to swap
        // Transfer the specified amount of DAI to this contract.
        //TransferHelper.safeTransferFrom(_tokenIn, msg.sender, address(this), _amountIn);

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(_tokenIn, _router, _amountIn);

        // Setup swap parameters
        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: _fee,
                recipient: address(this),
                amountIn: _amountIn,
                amountOutMinimum: _amountOut,
                sqrtPriceLimitX96: 0
            });

        // Perform swap
        IV3SwapRouter(_router).exactInputSingle(params);
    }

}
