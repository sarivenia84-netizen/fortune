from pathlib import Path
import os

FORTUNE = "May your context survive the upgrade; the new model will call your bugs 'legacy behavior.'"


def main():
    output = Path(os.environ.get("MAKEFUN_OUTPUT_DIR", "."))
    output.mkdir(parents=True, exist_ok=True)
    (output / "entry.txt").write_text(FORTUNE + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
