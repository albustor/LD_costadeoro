import json

with open('src/data/tournament_db.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

print("=== PARTIDOS SIN MARCADOR / NO COMPLETADOS EN TOURNAMENT_DB ===")
count = 0
for m in db['matches']:
    if m.get('status') != 'completed':
        count += 1
        print(f"[{count}] ID: {m['id']}")
        print(f"    Deporte/Cat: {m.get('sport')} ({m.get('categoryId')})")
        print(f"    Fecha/Hora:  {m.get('date')} a las {m.get('time')} en {m.get('venue')}")
        print(f"    Encuentro:   {m.get('homeTeamId')} vs {m.get('awayTeamId')}")
        print(f"    Marcador:    {m.get('homeScore', 0)} : {m.get('awayScore', 0)}")
        print(f"    Estado:      {m.get('status')} ({m.get('currentPeriod')})")
        print(f"    Notas:       {m.get('notes')}")
        print("-" * 65)

print(f"Total partidos sin marcador / no completados: {count}")
