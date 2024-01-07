# Converted from https://github.com/jlopp/bitcoin-transaction-size-calculator/tree/master
import math

P2PKH_IN_SIZE = 148
P2PKH_OUT_SIZE = 34

P2SH_OUT_SIZE = 32
P2SH_P2WPKH_OUT_SIZE = 32
P2SH_P2WSH_OUT_SIZE = 32

# All segwit input sizes are reduced by 1 WU to account for the witness item counts being added for every input per the transaction header
P2SH_P2WPKH_IN_SIZE = 90.75

P2WPKH_IN_SIZE = 67.75
P2WPKH_OUT_SIZE = 31

P2WSH_OUT_SIZE = 43
P2TR_OUT_SIZE = 43

P2TR_IN_SIZE = 57.25

PUBKEY_SIZE = 33
SIGNATURE_SIZE = 72


def get_size_of_script_length_element(length):
    if length < 75:
        return 1
    elif length <= 255:
        return 2
    elif length <= 65535:
        return 3
    elif length <= 4294967295:
        return 5
    else:
        raise ValueError("Size of redeem script is too large")


def get_size_of_var_int(length):
    if length < 253:
        return 1
    elif length < 65535:
        return 3
    elif length < 4294967295:
        return 5
    elif length < 18446744073709551615:
        return 9
    else:
        raise ValueError("Invalid var int")


def get_tx_overhead_vbytes(input_script, input_count, output_count):
    if input_script == "P2PKH" or input_script == "P2SH":
        witness_vbytes = 0
    else:
        # Transactions with segwit inputs have extra overhead
        witness_vbytes = (
            0.25
            + 0.25  # segwit marker
            + input_count / 4  # segwit flag  # witness element count per input
        )

    return (
        4
        + get_size_of_var_int(input_count)  # nVersion
        + get_size_of_var_int(output_count)  # number of inputs
        + 4  # number of outputs
        + witness_vbytes  # nLockTime
    )


def get_tx_overhead_extra_raw_bytes(input_script, input_count):
    # Returns the remaining 3/4 bytes per witness bytes
    if input_script == "P2PKH" or input_script == "P2SH":
        witness_bytes = 0
    else:
        # Transactions with segwit inputs have extra overhead
        witness_bytes = (
            0.25
            + 0.25  # segwit marker
            + input_count / 4  # segwit flag  # witness element count per input
        )

    return witness_bytes * 3


def calc_tx_size(
    input_script,
    input_count,
    input_m=1,
    input_n=1,
    p2pkh_output_count=0,
    p2sh_output_count=0,
    p2sh_p2wpkh_output_count=0,
    p2sh_p2wsh_output_count=0,
    p2wpkh_output_count=0,
    p2wsh_output_count=0,
    p2tr_output_count=0,
):
    output_count = (
        p2pkh_output_count
        + p2sh_output_count
        + p2sh_p2wpkh_output_count
        + p2sh_p2wsh_output_count
        + p2wpkh_output_count
        + p2wsh_output_count
        + p2tr_output_count
    )

    input_script = input_script.upper()

    input_size = 0  # in virtual bytes
    input_witness_size = 0
    if input_script == "P2PKH":
        input_size = P2PKH_IN_SIZE
    elif input_script == "P2SH-P2WPKH":
        input_size = P2SH_P2WPKH_IN_SIZE
        input_witness_size = 107  # size(signature) + signature + size(pubkey) + pubkey
    elif input_script == "P2WPKH":
        input_size = P2WPKH_IN_SIZE
        input_witness_size = 107  # size(signature) + signature + size(pubkey) + pubkey
    elif input_script == "P2TR":
        input_size = P2TR_IN_SIZE
        input_witness_size = 65  # getSizeOfVarInt(schnorrSignature) + schnorrSignature
    elif input_script == "P2SH":
        redeem_script_size = (
            1  # OP_M
            + input_n * (1 + PUBKEY_SIZE)  # OP_PUSH33 <pubkey>
            + 1  # OP_N
            + 1  # OP_CHECKMULTISIG
        )
        script_sig_size = (
            1  # size(0)
            + input_m * (1 + SIGNATURE_SIZE)  # size(SIGNATURE_SIZE) + signature
            + get_size_of_script_length_element(redeem_script_size)
            + redeem_script_size
        )
        input_size = 32 + 4 + get_size_of_var_int(script_sig_size) + script_sig_size + 4
    elif input_script == "P2SH-P2WSH" or input_script == "P2WSH":
        redeem_script_size = (
            1  # OP_M
            + input_n * (1 + PUBKEY_SIZE)  # OP_PUSH33 <pubkey>
            + 1  # OP_N
            + 1  # OP_CHECKMULTISIG
        )
        input_witness_size = (
            1  # size(0)
            + input_m * (1 + SIGNATURE_SIZE)  # size(SIGNATURE_SIZE) + signature
            + get_size_of_script_length_element(redeem_script_size)
            + redeem_script_size
        )
        input_size = 36 + input_witness_size / 4 + 4
        if input_script == "P2SH-P2WSH":
            input_size += 32 + 3  # P2SH wrapper (redeemscript hash) + overhead?

    tx_vbytes = (
        get_tx_overhead_vbytes(input_script, input_count, output_count)
        + input_size * input_count
        + P2PKH_OUT_SIZE * p2pkh_output_count
        + P2SH_OUT_SIZE * p2sh_output_count
        + P2SH_P2WPKH_OUT_SIZE * p2sh_p2wpkh_output_count
        + P2SH_P2WSH_OUT_SIZE * p2sh_p2wsh_output_count
        + P2WPKH_OUT_SIZE * p2wpkh_output_count
        + P2WSH_OUT_SIZE * p2wsh_output_count
        + P2TR_OUT_SIZE * p2tr_output_count
    )
    tx_vbytes = math.ceil(tx_vbytes)

    tx_bytes = (
        get_tx_overhead_extra_raw_bytes(input_script, input_count)
        + tx_vbytes
        + (input_witness_size * input_count * 3) / 4
    )
    tx_weight = tx_vbytes * 4

    return {"tx_vbytes": tx_vbytes, "tx_bytes": tx_bytes, "tx_weight": tx_weight}
