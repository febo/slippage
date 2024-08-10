# slippage

Single instruction program to assert whether the amount of a token account is greter than or equal to an amount in instruction data.

This is just an exercise to see how a progrma written with [`pinocchio`](https://github.com/febo/pinocchio) compares to one written in [`sBPF ASM`](https://github.com/deanmlittle/sbpf-asm-slippage).

##### Cost comparison

Size:
* sBPF ASM: `~1.3kb`
* pinocchio: `~19kb`

Compute:
* sBPF ASM: `4 CU` (pass case)
* pinocchio: `25 CU` (pass case)

Overall not too close, but also not too far.
