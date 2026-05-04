import pandas as pd
import re

# 파일 경로
file_path = "/Users/artilm/Library/Mobile Documents/com~apple~CloudDocs/Documents/☀︎★ 1. OCTR/🔥ar/merged_output/wide_all_with_weather_410_417_509.csv"

# 데이터 로드
df = pd.read_csv(file_path)

# 컬럼명 정리
df.columns = df.columns.astype(str).str.strip()

# ============================================================
# AHU + MDT / SDT / RDT 컬럼만 추출
# ============================================================

cols = [
    c for c in df.columns
    if ("AHU" in c.upper()) and any(k in c.upper() for k in ["MDT", "SDT", "RDT"])
]

df_subset = df[cols]

print("Selected columns:")
print(cols)

print("\nPreview:")
print(df_subset.head())

# ============================================================
# AHU별로 그룹핑 (옵션)
# ============================================================

ahu_dict = {}

for c in cols:
    match = re.search(r"AHU(\d+)", c)
    if match:
        ahu_no = int(match.group(1))
        ahu_dict.setdefault(ahu_no, []).append(c)

print("\nAHU별 컬럼:")
for k, v in ahu_dict.items():
    print(f"AHU {k}: {v}")

# ============================================================
# 저장 (옵션)
# ============================================================

output_path = file_path.replace(".csv", "_ahu_mdt_sdt_rdt_only.csv")
df_subset.to_csv(output_path, index=False)

print(f"\nSaved to: {output_path}")