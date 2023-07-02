const fs = require("fs");
const path = require('path');
const { buildMimc7 } = require("circomlibjs");

let mimc;
let F;

function readJSONFilesInFolder(folderPath) {
    const files = fs.readdirSync(folderPath);
    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    const jsonData = [];

    jsonFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileData = fs.readFileSync(filePath, 'utf-8');

        try {
            const parsedData = JSON.parse(fileData);
            jsonData.push(parsedData);
        } catch (error) {
            console.error(`Error parsing JSON file ${file}: ${error}`);
        }
    });

    return jsonData;
}

function stringToAsciiBytes(str) {
    const asciiBytes = [];

    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        asciiBytes.push(charCode);
    }

    return asciiBytes;
}

function byteArrayToHexString(byteArray) {
    const hexChars = [];

    for (let i = 0; i < byteArray.length; i++) {
        const hex = byteArray[i].toString(16).padStart(2, '0');
        hexChars.push(hex);
    }

    return hexChars.join('');
}

function convertStringAsciiToNumber(string) {
    return BigInt("0x".concat(...byteArrayToHexString(stringToAsciiBytes(string)))).toString()
}

function hash(arr) {
    // return F.toObject(babyJub.unpackPoint(mimc.hash(L, R))[0]);
    return F.toObject(mimc.multiHash(arr, 0));
}

const main = async () => {
    /**
     * test gen input file for circuit
     */

    // init tree
    mimc = await buildMimc7();
    F = await mimc.F;

    console.log(mimc.cts);

    // load userInfo Data
    const folderPath = 'test/userInfo';
    const jsonFilesData = readJSONFilesInFolder(folderPath);

    let userInfosCircuit = [];
    let encodeUserInfo;
    let userInfoHashed = [];

    /**
     * Encode userInfo
     * - creditCardNumber: convert string to bigint
     * - creditCardExpire: int
     * - ownerName: decode ascii then convert to BigNum
     * - cvv: convert string to int
     */
    for (let i = 0; i < jsonFilesData.length; i++) {
        encodeUserInfo = {
            creditCardNumber: parseInt(jsonFilesData[i].creditCardNumber, 10),
            creditCardExpireDate: jsonFilesData[i].creditCardExpireDate,
            cvv: parseInt(jsonFilesData[i].cvv, 10),
            ownerName: convertStringAsciiToNumber(jsonFilesData[i].ownerName),
            amount: parseInt(jsonFilesData[i].amount, 10)
        }
        userInfosCircuit.push(encodeUserInfo)
    }
    // console.log(userInfosCircuit)

    for (i = 0; i < jsonFilesData.length; i++) {
        //create user leaf
        userInfoHashed.push(hash([userInfosCircuit[i].creditCardNumber, userInfosCircuit[i].creditCardExpireDate, userInfosCircuit[i].cvv, userInfosCircuit[i].ownerName]))
        //add leaf to tree
    }

    // gen input for circuit creating proof  for 1st user
    let userIndex = 0;

    // console.log(siblings)
    const input = {
        creditCardNumber: userInfosCircuit[userIndex].creditCardNumber,
        creditCardExpireDate: userInfosCircuit[userIndex].creditCardExpireDate,
        cvv: userInfosCircuit[userIndex].cvv,
        ownerName: userInfosCircuit[userIndex].ownerName,            
        amount:  userInfosCircuit[userIndex].amount,
        userInfoHashed: userInfoHashed[userIndex].toString(),
        availableTime: Math.floor(Date.now() / 1000) + 60,
    }

    json = JSON.stringify(input, null, 2);
    fs.writeFile("src/user/input.json", json, (err) => {
        if (err) {
          console.error('Error saving JSON file:', err);
        } else {
          console.log('JSON file saved successfully!');
        }
      });
};

main()
    .then(() => { })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });