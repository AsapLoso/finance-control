# FinanceControl — Integriteitsverificatie

We bieden Finance.Control aan als een gecompileerde `.exe` en als een `.zip` pakket.

Hieronder vind je de SHA-256 checksums van de officiële distributiebestanden, zodat je kunt verifiëren dat de bestanden niet corrupt zijn geraakt tijdens het downloaden.

## Hashes

| Bestand | Type | SHA-256 Checksum |
|---|---|---|
| `FinanceControl.zip` | Folder release | `6C31537D6586563D51EBCE82C9EB6B76CD59C57D4BEC451C670E20260FBC4AF5` |
| `FinanceControl.exe` | Single-file release | `AF57E51F7BDFFF870D62A79DF651ED3EDEB2C9BE9DF3F10922791B1F55C3E974` |

## Hoe te verifiëren (Windows PowerShell)

Open PowerShell in de map waar je het bestand hebt gedownload en run:

```powershell
Get-FileHash .\FinanceControl.zip -Algorithm SHA256
# Of voor de .exe:
Get-FileHash .\FinanceControl.exe -Algorithm SHA256
```

Vergelijk de output hash met de tabel hierboven om zeker te zijn van een veilige download.
