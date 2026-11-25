"""Compatibility entry point for GK80 release 6; read-only verification."""
import sys
sys.dont_write_bytecode = True
from gk80_release_decimal import verify_release

if __name__ == '__main__':
    verify_release(6)
