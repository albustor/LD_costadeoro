import sys
import os
import json

BASE_DIR = os.path.abspath(".")
sys.path.insert(0, os.path.join(BASE_DIR, "src", "scripts"))
from generate_canonical_standings import generate_canonical_standings

db_path = os.path.join(BASE_DIR, "src", "data", "tournament_db.json")
with open(db_path, "r", encoding="utf-8") as f:
    db = json.load(f)

# Filter out the 4 matches:
# j2-vol-c-01: Educarte 2-0 Tempisque (never reported by Don Alejandro)
# j3-fut-fem-01, 02, 03: Ghost fixtures from old October calendar draft
db["matches"] = [m for m in db["matches"] if m["id"] not in ["j2-vol-c-01", "j3-fut-fem-01", "j3-fut-fem-02", "j3-fut-fem-03"]]

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

generate_canonical_standings()

cs_path = os.path.join(BASE_DIR, "src", "data", "canonical_standings.json")
with open(cs_path, "r", encoding="utf-8") as f:
    cs = json.load(f)

print("\n=== POSICIONES VOLEIBOL C ===")
for r in cs["computed_standing_points"]["cat-c-voleibol"]:
    print(f"{r['position']} | {r['school']['shortName']} | PJ: {r['played']} | PG: {r['won']} | PP: {r['lost']} | PTS: {r['points']} | Sets: {r['setsWon']}-{r['setsLost']}")

print("\n=== POSICIONES FUTBOL FEMENINO ===")
for r in cs["computed_standing_points"]["cat-fem-futbol"]:
    print(f"{r['position']} | {r['school']['shortName']} | PJ: {r['played']} | PG: {r['won']} | PE: {r['drawn']} | PP: {r['lost']} | PTS: {r['points']} | Goles: {r['pointsFor']}-{r['pointsAgainst']}")
