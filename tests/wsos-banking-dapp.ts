import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WsosBankingDapp } from "../target/types/wsos_banking_dapp";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { decode } from "@project-serum/anchor/dist/cjs/utils/bytes/bs58";
import { assert } from "chai";

describe("wsos-banking-dapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.WsosBankingDapp as Program<WsosBankingDapp>;

  let user = anchor.web3.Keypair.fromSecretKey(
    decode(
      "5NM9jDALj6viMgvF9HKZt3hrrUVPddfpsg4VUuddCk6ff3XyaaP533ZL6j74HUKgLHBYSQom5ArTLDiPNxwtNi7W"
    )
  );

  let [bank, nonce] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("bank_account"), user.publicKey.toBuffer()],
    program.programId
  );
  it("Create Account", async () => {
    console.log("Bank Account: ", bank.toBase58());
    console.log("Bank Account Nonce: ", nonce);

    const tx = await program.methods
      .create("Sili-gone Valley Bank")
      .accounts({
        bank: bank,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    console.log("Tx: ", tx);

    const bankAccount = await program.account.bank.fetch(bank);
    assert.ok(bankAccount.balance.eq(new anchor.BN(0)));
    assert.ok(bankAccount.name === "Sili-gone Valley Bank");
    assert.ok(bankAccount.owner.equals(user.publicKey));
  });

  it("Deposit", async () => {
    const userAccount = await program.provider.connection.getAccountInfo(
      user.publicKey
    );
    console.log("Balance before: ", userAccount.lamports);

    const tx = await program.methods
      .deposit(new anchor.BN(1_000_000_000))
      .accounts({
        bank: bank,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    console.log("Tx: ", tx);

    const bankAccount = await program.account.bank.fetch(bank);
    console.log("Balance: ", bankAccount.balance.toNumber());
    console.log("Balance left: ", userAccount.lamports);
    
    assert.ok(bankAccount.balance.eq(new anchor.BN(1_000_000_000)));
  });

  it("Withdraw", async () => {
    const tx = await program.methods
      .withdraw(new anchor.BN(500_000_000))
      .accounts({
        bank: bank,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
      console.log("Tx: ", tx);

      const bankAccount = await program.account.bank.fetch(bank);
      console.log("Balance: ", bankAccount.balance.toNumber());
      const bankAccountInfo = await program.provider.connection.getAccountInfo(bank);
      console.log("Balance left: ", bankAccountInfo.lamports);
      
      // assert.ok(bankAccount.balance.eq(new anchor.BN(500_000_000)));
  });
});
