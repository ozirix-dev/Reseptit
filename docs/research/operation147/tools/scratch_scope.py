"""Destination validation only; not a sandbox for imported code."""
import subprocess
from pathlib import Path
def assert_scratch(destination):
    existing=Path(destination).resolve()
    while not existing.exists():existing=existing.parent
    result=subprocess.run(['git','rev-parse','--show-toplevel'],cwd=existing,text=True,capture_output=True)
    if result.returncode==0:raise ValueError('Scratch destination is in a Git worktree: '+result.stdout.strip())
    if result.returncode!=128:raise RuntimeError('Cannot verify scratch destination: '+result.stderr.strip())
