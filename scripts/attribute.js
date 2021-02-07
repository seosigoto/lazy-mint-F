const fs = require("fs");
const prevMetadata = require("./1.json");
const imageIPFSHash = "https://gateway.pinata.cloud/ipfs/QmRkjzRhiuLRMkAm2maQnQr1FyE6xXDfD6KSx6Coq7aLF4/";
const videoIPFSHash = "https://exposedwalls.mypinata.cloud/ipfs/QmUERvuA4K7sEDR9Eeka3rqBY1rwna8hjZjDNPgm1EkhKx/";
const backimageIPFSHash1 = "https://gateway.pinata.cloud/ipfs/QmV9RTBhdX3eYsNiWGtjWwfrrZutZtkxtAYU95FJz6ZVPY/";
const backimageIPFSHash2 = "https://gateway.pinata.cloud/ipfs/QmWaa5UGRAZNqyBWFYFnwPWGyWGHCLYcNCB2ZAdFj3JYTm/";
let backimageIPFSHash = backimageIPFSHash1;
for (let i = 0; i < prevMetadata.length; i++) {
    const metadata = prevMetadata[i];    
    if (i > 5000) {
        backimageIPFSHash = backimageIPFSHash2;
      }
    const json = {
        description: `This is #1 of the ‘Gorilla in a Pink Mask’ NFT, which has been produced in a fractionalised edition of 10,000 by Exposed Walls. 
        Each NFT package comprises of 3 elements: \n
        — A jpeg containing the fractionalised artwork magnified x 40 with related metadata, purity level and rarity score - Link Of Image\n
        — A jpeg with crosshairs to indicate the location of the fraction on the artwork Link of the image\n
        — A 10 second animation showing the jpegs rotating in 3D played in a loop. Link Of the video\n
        Exposed Walls is delighted to present the ‘Gorilla in Pink Mask’ NFT. The artwork has been fractionalised into 10,000 parts, and each NFT represents that segment of the wall on which it was painted, offering the chance to own a unique collectible.\n\n
        Banksy’s fame rests on the murals he has been creating from the early 1990s. He is believed to have made more than 500 of these unique pieces. ‘Gorilla in a Pink Mask’ first appeared on the wall of the former North Bristol Social Club in Fishponds Road, Eastville, Bristol. This later became the Jalalabad Cultural Centre, where it was painted over in 2011 by the owner. In September 2020, it was removed from the centre with permission by Exposed Walls, an restoration company which now owns the work.\n\n
        ‘Gorilla in a Pink Mask’ is believed to be the first time Banksy portrayed a primate in his work and can be seen as a precursor to ‘Devolved Parliament’, 2009, which depicts chimpanzees and orangutans debating in the House of Commons. By then, monkeys had become a recurring motif: they can be found listening to music on headphones or in one case preparing to detonate a bomb. The artist uses them to draw parallels between humans and their closest relatives in the animal kingdom, employing them to critique power, corruption and consumerism. Examples include ‘Laugh Now’, 2003, which showed a row of apes with sandwich-boards carrying the inscription ‘Laugh now, but one day we’ll be in charge’; in another, ‘Monkey Queen’, 2003, one is used as a stand-in for the Queen.`,        
        image: `${videoIPFSHash}${metadata.codeNoHash}.mp4`,
        name: "",
        attributes: [
            {
                trait_type: "Rarity Score",
                value: metadata.ranking
            },
            {
                trait_type: " Pixels pink",
                value: metadata.sumPink
            },
            {
                trait_type: " Dark Grey Pixels",
                value: metadata.sumDarkGrey
            },
            {
                trait_type: "Light Grey Pixels",
                value: metadata.sumLightGrey
            },
            {
                trait_type: " Ochre Pixels",
                value: metadata.sumOchre
            },
            {
                trait_type: "Sand Pixels",
                value: metadata.sumSand
            },
            {
                trait_type: "Purity Level",
                value: metadata.purityNameCalc
            }                                         
        ]
    };

    fs.writeFileSync(`./output/${metadata.codeNoHash}.json`, JSON.stringify(json));
}