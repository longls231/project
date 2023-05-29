# CreditCard_Circuit
```
npm i
```
# Gen Proof
run snarkjs iden3 example

# Gen Input 
test gen input for proof
```
node test/genInput.js
```
# Gen Proof
```
cd src/user
circom *.circom --r1cs --wasm
snarkjs g16s *.r1cs ../../ptau/powersOfTau28_hez_final_12.ptau  circuit_final.zkey
snarkjs zkey export solidityverifier *.zkey verifier.sol
cd creditcard_js
node generate_witness.js ./*.wasm ../input.json ../witness.wtns
cd ..
snarkjs g16p circuit_final.zkey witness.wtns proof.json public.json
snarkjs zkey export soliditycalldata public.json proof.json
```
# Test
Deploy verifier.sol contract
Use result after running "snarkjs zkey export soliditycalldata public.json proof.json" for inputs contract
