# FinanceControl — Integriteitsverificatie

We bieden Finance.Control aan als een gecompileerde `.exe` en als een `.zip` pakket.

Hieronder vind je de SHA-256 checksums van de officiële distributiebestanden, zodat je kunt verifiëren dat de bestanden niet corrupt zijn geraakt tijdens het downloaden.

## Hashes

| Bestand | Type | SHA-256 Checksum |
|---|---|---|
| `FinanceControl.zip` | Folder release | `DFA60E14D9A3F2685BB2CF4B84E698F5A0F9CA7767C509BF00FBE83C6484BCCB` |
| `FinanceControl.exe` | Single-file release | `397A760431D179C5C3B2A549E26031440272D9D31DE322C11F578E640CC50FAA` |

## Hoe te verifiëren (Windows PowerShell)

Open PowerShell in de map waar je het bestand hebt gedownload en run:

```powershell
Get-FileHash .\FinanceControl.zip -Algorithm SHA256
# Of voor de .exe:
Get-FileHash .\FinanceControl.exe -Algorithm SHA256
```

Vergelijk de output hash met de tabel hierboven om zeker te zijn van een veilige download.
