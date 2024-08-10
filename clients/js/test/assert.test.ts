import { appendTransactionMessageInstruction, pipe } from '@solana/web3.js';
import test from 'ava';
import {
  getAssertInstruction,
  SLIPPAGE_ERROR__SLIPPAGE_EXCEEDED,
} from '../src';
import {
  createDefaultSolanaClient,
  createDefaultTransaction,
  createMint,
  createTokenWithAmount,
  generateKeyPairSignerWithSol,
  signAndSendTransaction,
} from './_setup';

test('assert with equal amount', async (t) => {
  // Given an authority key pair with some SOL.

  const client = createDefaultSolanaClient();
  const payer = await generateKeyPairSignerWithSol(client);

  // And a mint and token account with amount equal to 1_000_000_000n.

  const mint = await createMint(client, payer, payer.address);
  const tokenAccount = await createTokenWithAmount(
    client,
    payer,
    payer,
    mint,
    payer.address,
    1_000_000_000n
  );

  // When we assert the account holding against 1_000_000_000.

  const assertIx = getAssertInstruction({
    tokenAccount,
    amount: 1_000_000_000n,
  });
  await pipe(
    await createDefaultTransaction(client, payer),
    (tx) => appendTransactionMessageInstruction(assertIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then the assertion passes.

  t.pass();
});

test('assert with greater amount', async (t) => {
  // Given an authority key pair with some SOL.

  const client = createDefaultSolanaClient();
  const payer = await generateKeyPairSignerWithSol(client);

  // And a mint and token account with amount equal to 2_000_000_000.

  const mint = await createMint(client, payer, payer.address);
  const tokenAccount = await createTokenWithAmount(
    client,
    payer,
    payer,
    mint,
    payer.address,
    2_000_000_000n
  );

  // When we assert the account holding against 900_000_000.

  const assertIx = getAssertInstruction({
    tokenAccount,
    amount: 900_000_000n,
  });
  await pipe(
    await createDefaultTransaction(client, payer),
    (tx) => appendTransactionMessageInstruction(assertIx, tx),
    (tx) => signAndSendTransaction(client, tx)
  );

  // Then the assertion passes.

  t.pass();
});

test('assert with lesser amount', async (t) => {
  // Given an authority key pair with some SOL.

  const client = createDefaultSolanaClient();
  const payer = await generateKeyPairSignerWithSol(client);

  // And a mint and token account with amount equal to 500_000_000.

  const mint = await createMint(client, payer, payer.address);
  const tokenAccount = await createTokenWithAmount(
    client,
    payer,
    payer,
    mint,
    payer.address,
    500_000_000n
  );

  // When we assert the account holding against 600_000_000.

  const assertIx = getAssertInstruction({
    tokenAccount,
    amount: 600_000_000n,
  });

  try {
    await pipe(
      await createDefaultTransaction(client, payer),
      (tx) => appendTransactionMessageInstruction(assertIx, tx),
      (tx) => signAndSendTransaction(client, tx)
    );
    t.fail('Amount should be lesser than the expected amount');
  } catch (error) {
    t.like(error, {
      cause: {
        context: {
          code: SLIPPAGE_ERROR__SLIPPAGE_EXCEEDED,
        },
      },
    });
  }
});
