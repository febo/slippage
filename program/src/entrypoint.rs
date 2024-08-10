use pinocchio::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

// Using the optional `entrypoint` parameter to specify the number of accounts
// expecected by the program.
entrypoint!(process_instruction, 1);

macro_rules! unpack_u64 {
    ( $pointer:expr ) => {
        &*($pointer as *const u64) as &u64
    };
}

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Compare the values directly from the instruction data and the account data.
    //
    // Note: we are not checking the range on the arrays, since it seems that this
    // is also the case for the sbpf-asm version.
    let exceeded = unsafe {
        let limit = unpack_u64!(instruction_data.as_ptr());
        let amount = unpack_u64!(accounts[0].unchecked_borrow_data()[64..72].as_ptr());

        limit > amount
    };

    if exceeded {
        msg!("jamIX: Slippage exceeded");
        Err(0.into())
    } else {
        Ok(())
    }
}
