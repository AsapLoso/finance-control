# FinanceControl — Integriteitsverificatie

We bieden Finance.Control aan als een gecompileerde `.exe` en als een `.zip` pakket.

Hieronder vind je de SHA-256 checksums van de officiële distributiebestanden, zodat je kunt verifiëren dat de bestanden niet corrupt zijn geraakt tijdens het downloaden.

## Hashes

| Bestand | Type | SHA-256 Checksum |
|---|---|---|
| `FinanceControl.zip` | Folder release | `FC554ECD60837774BAF27BD99335BDDC0483E0D7E8A68A1147ADA760BEC3024C` |
| `FinanceControl.exe` | Single-file release | `8FC7D20F09BEE8781CF314CAD5EB8904080BC72C0A838CB04038FED6CE8D99E0` |

## Hoe te verifiëren (Windows PowerShell)

Open PowerShell in de map waar je het bestand hebt gedownload en run:

```powershell
Get-FileHash .\FinanceControl.zip -Algorithm SHA256
# Of voor de .exe:
Get-FileHash .\FinanceControl.exe -Algorithm SHA256
```

Vergelijk de output hash met de tabel hierboven om zeker te zijn van een veilige download.
