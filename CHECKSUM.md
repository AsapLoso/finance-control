# FinanceControl — Integriteitsverificatie

We bieden Finance.Control aan als een gecompileerde `.exe` en als een `.zip` pakket.

Hieronder vind je de SHA-256 checksums van de officiële distributiebestanden, zodat je kunt verifiëren dat de bestanden niet corrupt zijn geraakt tijdens het downloaden.

## Hashes

| Bestand | Type | SHA-256 Checksum |
|---|---|---|
| `FinanceControl.zip` | Folder release | `23BA7A2A0377A38EFFD76EC312DEA2E90B5D97168C16D373676E711ED6DFC25B` |
| `FinanceControl.exe` | Single-file release | `AF30E0C607204CBEBF39B9B6B77814B419232FDBBA195CF5C5592155E44EAD01` |

## Hoe te verifiëren (Windows PowerShell)

Open PowerShell in de map waar je het bestand hebt gedownload en run:

```powershell
Get-FileHash .\FinanceControl.zip -Algorithm SHA256
# Of voor de .exe:
Get-FileHash .\FinanceControl.exe -Algorithm SHA256
```

Vergelijk de output hash met de tabel hierboven om zeker te zijn van een veilige download.
