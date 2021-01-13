const fs = require("fs");
const prevMetadata = require("./1.json");
const imageIPFSHash = "https://gateway.pinata.cloud/ipfs/QmRkjzRhiuLRMkAm2maQnQr1FyE6xXDfD6KSx6Coq7aLF4/";

for (let i = 0; i < prevMetadata.length; i++) {
    const metadata = prevMetadata[i];
    const json = {
        description: "",
        image: `${imageIPFSHash}${metadata.codeNoHash}.jpg`,
        name: "",
        attributes: [
            {
                trait_type: "ranking",
                value: metadata.ranking
            },
            {
                trait_type: "serial",
                value: metadata.serial
            },
            {
                trait_type: "sumDarkGrey",
                value: metadata.sumDarkGrey
            },
            {
                trait_type: "sumLightGrey",
                value: metadata.sumLightGrey
            },
            {
                trait_type: "sumOchre",
                value: metadata.sumOchre
            },
            {
                trait_type: "sumPink",
                value: metadata.sumPink
            },
            {
                trait_type: "sumSand",
                value: metadata.sumSand
            },
            {
                trait_type: "purityNameCalc",
                value: metadata.purityNameCalc
            }
        ]
    };

    fs.writeFileSync(`./output/${metadata.codeNoHash}.json`, JSON.stringify(json));
    // console.log(json);
}