use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("CqYTacg7Gu53PMSvH5GH7zigVjKJdYXjbVyZjAzYYYka");

#[program]
pub mod wsos_banking_dapp {
    use super::*;

    pub fn create(ctx: Context<Create>, name: String) -> ProgramResult {
        let bank = &mut ctx.accounts.bank;
        bank.name = name;
        bank.balance = 0;
        bank.owner = *ctx.accounts.user.key;
        Ok({})
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> ProgramResult {
        let txn = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.bank.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &txn,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.bank.to_account_info(),
            ],
        )?;
        (&mut ctx.accounts.bank).balance += amount;
        Ok({})
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let bank = &mut ctx.accounts.bank;
        let user = &mut ctx.accounts.user;
        require!(bank.owner == *user.key, ErrorCode::InvalidBankOwner);
        let rent = Rent::get()?.minimum_balance(bank.to_account_info().data_len());
        require!(bank.balance - rent >= amount, ErrorCode::InsufficientFunds);
        require!(amount > 0, ErrorCode::InvalidWithdrawAmount);
        **bank.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        Ok({})
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[
        account(init, 
        payer = user, 
        space = 5000, 
        seeds = [b"bank_account", user.key().as_ref()], 
        bump)
    ]
    pub bank: Account<'info, Bank>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub bank: Account<'info, Bank>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub bank: Account<'info, Bank>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Bank {
    pub name: String,
    pub balance: u64,
    pub owner: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds.")]
    InsufficientFunds,
    #[msg("Invalid amount.")]
    InvalidAmount,
    #[msg("Invalid bank account.")]
    InvalidBankAccount,
    #[msg("Invalid user account.")]
    InvalidUserAccount,
    #[msg("Invalid withdraw amount.")]
    InvalidWithdrawAmount,
    #[msg("Invalid deposit amount.")]
    InvalidDepositAmount,
    #[msg("Invalid bank owner.")]
    InvalidBankOwner,
    #[msg("Invalid user.")]
    InvalidUser,
}
