/**
_____   __                       __________      _____                    
___  | / /__________ ________    ___  ____/___  ___  /____  _____________ 
__   |/ /_  _ \  __ `/_  ___/    __  /_   _  / / /  __/  / / /_  ___/  _ \
_  /|  / /  __/ /_/ /_  /        _  __/   / /_/ // /_ / /_/ /_  /   /  __/
/_/ |_/  \___/\__,_/ /_/         /_/      \__,_/ \__/ \__,_/ /_/    \___/ 
______        ______                     _____                            
___  / ______ ___  /____________________ __  /__________________  __      
__  /  _  __ `/_  __ \  __ \_  ___/  __ `/  __/  __ \_  ___/_  / / /      
_  /___/ /_/ /_  /_/ / /_/ /  /   / /_/ // /_ / /_/ /  /   _  /_/ /       
/_____/\__,_/ /_.___/\____//_/    \__,_/ \__/ \____//_/    _\__, /        
                                                           /____/     
*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev {ERC20} token, including:
 *
 *  - Preminted initial supply
 *  - Ability for holders to burn (destroy) their tokens
 *  - No access control mechanism (for minting/pausing) and hence no governance
 *
 * This contract uses {ERC20Burnable} to include burn capabilities - head to
 * its documentation for details.
 *
 * _Available since v3.4._
 */
contract NearFutureLaboratory is ERC20Capped, ERC20Burnable, Pausable, Ownable {
    event Rescind(address from, uint256 amount);
    event Burn(address from, uint256 amount);
    uint256 initialTokenCap = 1000000;

    constructor() 
    ERC20("Near Future Laboratory", "NFLAB") 
    ERC20Capped(initialTokenCap * (10**uint256(decimals()))) {
        require(
            msg.sender != address(0),
            "ERC20: cannot mint from the zero address"
        );
        ERC20._mint(owner(), initialTokenCap * (10**uint256(decimals())) );
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Function to mint tokens.
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    

    /**
     *  - We can rescind tokens if need be.
     */
    function rescindTokens(address rescindFrom, uint256 amount)
        public
        onlyOwner
    {
        _transfer(rescindFrom, owner(), amount);

        emit Rescind(rescindFrom, amount);
    }

    function burn(uint256 amount) public override {
        ERC20Burnable.burn(amount);
        emit Burn(_msgSender(), amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Capped) {
        require(totalSupply() + amount <= cap(), "Mint would exceed total cap"); 
        super._mint(to, amount);
    }

}
