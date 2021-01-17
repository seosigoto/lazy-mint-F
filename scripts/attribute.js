const fs = require("fs");
const prevMetadata = require("./1.json");
const imageIPFSHash = "https://gateway.pinata.cloud/ipfs/QmRkjzRhiuLRMkAm2maQnQr1FyE6xXDfD6KSx6Coq7aLF4/";
const videoIPFSHash = "https://exposedwalls.mypinata.cloud/ipfs/QmV5zmADFWZgKP7B7v25NmX2AfVhBtKiBzQjcAGyRzN3iC/";
const backimageIPFSHash1 = "https://gateway.pinata.cloud/ipfs/QmV9RTBhdX3eYsNiWGtjWwfrrZutZtkxtAYU95FJz6ZVPY/";
const backimageIPFSHash2 = "https://gateway.pinata.cloud/ipfs/QmWaa5UGRAZNqyBWFYFnwPWGyWGHCLYcNCB2ZAdFj3JYTm/";
let backimageIPFSHash = backimageIPFSHash1;
for (let i = 0; i < prevMetadata.length; i++) {
    const metadata = prevMetadata[i];    
    if (i > 5000) {
        backimageIPFSHash = backimageIPFSHash2;
      }
    const json = {
        description: `This is #${metadata.codeNoHash}of the Gorilla….fractionalise of 10,000
        Rarity score is from 1 - 100 with 1 being the rarest
        Serial: ${metadata.serial}`,
        // image: `${imageIPFSHash}${metadata.codeNoHash}.jpg`,
        image: `${videoIPFSHash}${metadata.codeNoHash}.mp4`,
        name: "",
        attributes: [
            {
                trait_type: "Rarity Score",
                value: metadata.ranking
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
                trait_type: " Pink Pixels",
                value: metadata.sumPink
            },
            {
                trait_type: "Sand Pixels",
                value: metadata.sumSand
            },
            {
                trait_type: "Purity Level",
                value: metadata.purityNameCalc
            }
            // {
            //     trait_type: "imagelink",
            //     // value: `${videoIPFSHash}${metadata.codeNoHash}.mp4`
            //     value: `${imageIPFSHash}${metadata.codeNoHash}.jpg`,
            // },
            // {
            //     trait_type: "backimagelink",
            //     value: `${backimageIPFSHash}${metadata.codeNoHash}.png`
            // }
        ]
    };

     console.log('json');
    fs.writeFileSync(`./output/${metadata.codeNoHash}.json`, JSON.stringify(json));
}