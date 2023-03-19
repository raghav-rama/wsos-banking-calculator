import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WsosBankingDapp } from "../target/types/wsos_banking_dapp";

describe("wsos-banking-dapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.WsosBankingDapp as Program<WsosBankingDapp>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
