use anchor_lang::prelude::*;

declare_id!("CqYTacg7Gu53PMSvH5GH7zigVjKJdYXjbVyZjAzYYYka");

#[program]
pub mod wsos_banking_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
