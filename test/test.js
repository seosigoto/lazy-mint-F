const balance = require("@openzeppelin/test-helpers/src/balance");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

const ether = (amount) => {
  const weiString = ethers.utils.parseEther(amount.toString());
  return BigNumber.from(weiString);
};

describe("Lazy Minting Function", () => {

    let Lazy;
    let lazyContract;
    let owner;
    let contractAddr;

    beforeEach(async () => {
        Lazy = await ethers.getContractFactory("Lazy");
        [owner, addr1, addr2, addr3, addr4, addr5, addr6,...addrs] = await ethers.getSigners();

        lazyContract = await Lazy.deploy(owner.address);
        await lazyContract.deployed();

        contractAddr = lazyContract.address;

        // const provider = ethers.getDefaultProvider()
        // const balance = await provider.getBalance(owner.address)
        // const balanceInEth = ethers.utils.formatEther(balance)
        // console.log(`balance: ${balanceInEth} ETH`)
    });

    // Just making sure the contract is loading up as we expect.
    describe("Sanity check...", () => {
        // console.log("here");
        it("should set the correct token symbol", async () => {
            expect(await lazyContract.symbol() === "LAZY");
        });
    });

    /* We can imagine the owner of the NFT would sign a messsage containing
     the metadata for that specific NFT. They use their own private/public
     key pair  and the address is stored in the contract for reference.
     Once the message is signed, the owner passes the signature to the
     potential buyer who can call the mint function with the metadata
     and the signature as params. If the signature is validated, then the
     NFT is minted with the metadata passed to the function.
     ----
     this is an example of the postive case (working). */
    describe("Minting NFT with normal user purchasing", () => {
        it("should mint NFT to sender", async () => {
            let balance = await owner.getBalance();
            console.log("artist Balance : ", ethers.utils.formatEther(balance));

            balance = await addr1.getBalance();
            console.log("Address 1 Balance : ", ethers.utils.formatEther(balance));

            balance = await addr2.getBalance();
            console.log("Address 2 Balance : ", ethers.utils.formatEther(balance));

            balance = await addr3.getBalance();
            console.log("owner 1  Balance : (83%)", ethers.utils.formatEther(balance));

            balance = await addr4.getBalance();
            console.log("owner 2 Balance : (15%)", ethers.utils.formatEther(balance));

            balance = await addr5.getBalance();
            console.log("owner 3 Balance : (2%) ", ethers.utils.formatEther(balance));

            const metadata = "value: rare";
            const sig = signMessage(owner, metadata);
            const _tx = await lazyContract.connect(addr1).mintToken(metadata, sig, { value: ether(0.25) });

            expect(metadata === lazyContract.tokenURI(0));
            console.log("Updated Balance");
            balance = await owner.getBalance();
            console.log("artist Balance : ", ethers.utils.formatEther(balance));

            balance = await addr1.getBalance();
            console.log("Address 1 Balance : ", ethers.utils.formatEther(balance));

            balance = await addr2.getBalance();
            console.log("Address 2 Balance : ", ethers.utils.formatEther(balance));

            balance = await addr3.getBalance();
            console.log("owner 1 Balance : (83%)", ethers.utils.formatEther(balance));

            balance = await addr4.getBalance();
            console.log("owner 2 Balance : (15%)", ethers.utils.formatEther(balance));

            balance = await addr5.getBalance();
            console.log("owner 3 Balance : (2%)", ethers.utils.formatEther(balance));
        });
    });

    describe("Minting NFT with whitelist user purchasing", () => {
        it("should mint NFT to sender", async () => {
            let balance = await owner.getBalance();
            console.log("artist Balance : ", ethers.utils.formatEther(balance));

            balance = await addr6.getBalance();
            console.log("whitelist user Balance : ", ethers.utils.formatEther(balance));

            balance = await addr3.getBalance();
            console.log("owner 1  Balance : ", ethers.utils.formatEther(balance));

            balance = await addr4.getBalance();
            console.log("owner 2 Balance : ", ethers.utils.formatEther(balance));

            balance = await addr5.getBalance();
            console.log("owner 3 Balance : ", ethers.utils.formatEther(balance));

            const metadata = "value: rare";
            await lazyContract.connect(owner).addWhitelistuser(addr6.address);
            const sig = signMessage(owner, metadata);
            const _tx = await lazyContract.connect(addr6).mintToken(metadata, sig, { value: ether(0.25) });

            expect(metadata === lazyContract.tokenURI(0));
            console.log("Updated Balance");
            balance = await owner.getBalance();
            console.log("artist Balance : ", ethers.utils.formatEther(balance));

            balance = await addr6.getBalance();
            console.log("whitelist user Balance : ", ethers.utils.formatEther(balance));

            balance = await addr3.getBalance();
            console.log("owner 1 Balance : (58%)", ethers.utils.formatEther(balance));

            balance = await addr4.getBalance();
            console.log("owner 2 Balance : (40%)", ethers.utils.formatEther(balance));

            balance = await addr5.getBalance();
            console.log("owner 3 Balance : (2%)", ethers.utils.formatEther(balance));
            
        });
    });


    /* What we are trying to prevent is a bad actor from creating an NFT
     with incorrect metadata. If a bad actor _was_ able to create an NFT
     with incorrect metadata then they could forge ownership over a rare NFT.
     Think minting yourself a cryptokitty with any attributes you want.
     In order to prevent this behavior, the contract requires that the signature
     passed to the function validates to the address of the creator of the NFT
     which only allows for NFT metadata that is previously approved by the owner.
     -----
     this is an example of a bad actor trying to mint an NFT with incorrect metadata
     and shows how the contract throws in this case. */
});

    /* A known issue!
       ----
       Lets say we only want one NFT with a particular set of metadata.
       It's possible for a bad actor to incercept or even reuse the same
       signature/metadata combination to continuously mint NFTs with the
       approved set of metadata. There is currently no way to "expire" a
       signature as far as I know.

       Only solution I have to that problem so far is keeping an array of
       signature indices and including that in the message you sign.

       When the function gets the message as a param, it can write to the
       array of signature indices marking it as "used".

       Then, all prior minting transactions have to make sure the index is
       unused by reading the array.

       Unfortunately, this imposes addl costs, so I am experimenting with
       more elegant solutions.
     */


// Signs the message and returns the siganture.
// This is what NFT creators would use, and would pass
// the signature along to the buyer.
const signMessage = async (address, message) => {
    const hash = await ethers.utils.id(message);
    const sig  = await address.signMessage(ethers.utils.arrayify(hash));
    return sig;
}